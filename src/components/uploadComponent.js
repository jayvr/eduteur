import React, { useRef, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import {
	Container,
	Dropdown,
	DropdownItem,
	DropdownToggle,
	DropdownMenu,
	Form,
	Row,
	Input,
	FormGroup,
	Label,
	Button,
	CustomInput,
	Progress
} from 'reactstrap';
import { getFirestore } from 'redux-firestore';
import { useFirebase, isLoaded } from 'react-redux-firebase';
import Loading from "./LoadingComponent";

function Upload(props) {
	const [subjectItems, setSubjectItems] = useState(props.profile.subjects);
	const [moduleItems, setModuleItems] = useState([{ id: "0", name: "select the subject" }]);
	const [formData, setformData] = useState({
		title: "",
		desc: "",
		module: "",
		subject: "",
		author: "",
		sem: "",
		branch: "",
		uid: "",
		moduleID: "",
		isNewModule: false,
	})
	const [isFirstModule, setFirstModule] = useState(false)
	const [video, setVideo] = useState(null)
	const [file, setFile] = useState(null)

	const [progress, setProgress] = useState(0);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const toggle = () => setDropdownOpen((prevState) => !prevState);
	const [modToggle, setMod] = useState(false);

	const firebase = useFirebase();
	const firestore = getFirestore();


	// extract the modules form the selected subject field
	const handleSubject = (e) => {
		const index = e.target.id;
		const path = e.target.value;

		setformData({
			...formData,
			subject: e.target.name,
			branch: subjectItems[index].branch,
			sem: "sem" + subjectItems[index].sem,
		})

		firestore.doc(path).get()
			.then((doc) => {
				if (doc.exists && doc.data().modules != null) {
					setModuleItems(doc.data().modules);
					console.log(moduleItems);
				} else {
					setFirstModule(true);
					console.log("No such doc or field exists!")
				}
			})
			.catch((error) => {
				console.log('Error getting document:', error);
			});
	};

	// Update modules in put formData state when a module is selected
	const handleModule = (e) => {
		setformData({
			...formData,
			module: e.target.value,
			moduleID: e.target.id
		})
	};

	// will run when a new module is added
	// if it is first modeule - moduleID = 1 else it will increment to existing one
	const addModule = (e) => {
		if (isFirstModule) {
			setformData({
				...formData,
				module: e.target.value,
				moduleID: "1",
				isNewModule: true
			})
		} else {
			setformData({
				...formData,
				module: e.target.value,
				moduleID: moduleItems.length + 1,
				isNewModule: true
			})
		}
	}


	// Complete the formData state field with its respective value
	const handleChange = (e) => {
		const authName = props.profile.firstname + " " + props.profile.lastname;
		const authID = props.auth.uid;
		setformData({
			...formData,
			[e.target.name]: e.target.value,
			author: authName,
			uid: authID
		})
	}

	// store the file from file-upload field
	const handleVideo = (e) => {
		setVideo(e.target.files[0]);
	};
	const handleFile = (e) => {
		setFile(e.target.files[0]);
	};

	// a function that will upload the file to respective path.
	//  -- parameters --
	// path  - string             - path to upload file in storage
	// file  - a file/blob object - a file which is to be uploaded
	// fname - string             - name of file w.r.t lecture topic/title
	//  -- return --
	// URL - string - of the uploaded file
	async function fileUploader(path, file, fname) {
		var downURL = null;
		return new Promise((resolve, reject) => {
			console.log("Uploading...");
			const storageRef = firebase.storage().ref(`${path}${fname}`).put(file)
			storageRef.on("state_changed",
				snapshot => {
					const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
					setProgress(prog);
				},
				error => {
					console.log("Error in uploading " + file.name + " : " + error);
					reject(error);
				},
				async () => {
					downURL = await storageRef.snapshot.ref.getDownloadURL()
					console.log(`${file.name} uploaded successfully`);
					resolve(downURL);
				});
		});
	}

	// submit function of the form
	async function handleUpload(e) {

		e.preventDefault();

		var VideoURL = null;
		var FileURL = null;
		const videoName = formData.title;
		const fileName = videoName + " - Resources"

		console.log(formData);
		console.log("is first module: " + isFirstModule);
		console.log(video);
		console.log(file);

		const college = props.profile.college;
		const fullpath = `${college}/${formData.sem}/${formData.branch}/${formData.subject}/${formData.module}/`;
		const path = `${college}/${formData.sem}/${formData.branch}`

		console.log(fullpath);
		console.log(path);

		(async () => {
			VideoURL = await fileUploader(fullpath, video, videoName);
			console.log("Video URL: " + VideoURL);
		})().then(async () => {
			if (file != null) {
				FileURL = await fileUploader(fullpath, file, fileName);
				console.log("File URL: " + FileURL);
			}
		}).then(async () => {
			console.log('Creating Document...');
			// make a new doc for every new video/topic
			await firestore.collection(`${fullpath}`)
				.add({
					title: formData.title,
					dec: formData.desc,
					branch: formData.branch,
					createdAt: new Date(),
					module: formData.moduleID,
					moduleName: formData.module,
					sem: formData.sem,
					subject: formData.subject,
					author: formData.author,
					uid: formData.uid,
					fileURL: FileURL,
					videoURL: VideoURL
				})
				.then((res) => {
					console.log('Document is created');
					// update the MBR if new module is added
					if (formData.isNewModule) {
						console.log("Updating module MBR")
						firestore.collection(`${path}`).doc(`${formData.subject}`).set({
							modules: firebase.firestore.FieldValue.arrayUnion({
								id: formData.moduleID,
								name: formData.module
							})
						}, { merge: true }).then(() => console.log("Modules updated"))
					}
				}).catch((error) => {
					console.log(error);
				});
		})

	};

	// // display loding until user is profiled
	// function ProfileIsLoaded({ children }) {
	// 	const profile = useSelector(state => state.firebase.profile)
	// 	if (!isLoaded(profile)) {
	// 		return (
	// 			<Loading message="Loading Profile..." />
	// 		);
	// 	}
	// 	return children
	// }

	return (
		// <ProfileIsLoaded>
		<Form onSubmit={handleUpload}>
			<Container>
				<h1>Upload/Go Live</h1>
				<hr />
				<FormGroup className=" row offset-md-3">
					<Dropdown isOpen={dropdownOpen} toggle={toggle} >
						<DropdownToggle style={{ backgroundColor: 'blueviolet', color: 'white' }} caret>
							Subjects
							</DropdownToggle>
						<DropdownMenu>
							{subjectItems.map((item, index) => (
								<DropdownItem key={item.id} name={item.name} value={item.path} id={index} onClick={handleSubject}>
									{item.name}
								</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>
				</FormGroup>
				<FormGroup className="row">
					<Label for="selectModule" className="col-md-3">Module</Label>
					<CustomInput type="select" className="col-md-6" id="module" name="module" onChange={handleModule}>
						<option value="">Select the module </option>
						{
							moduleItems.map((item, index) => (
								<option key={item.id} id={index} value={item.name} name="module">
									{item.name}
								</option>
							))
						}
					</CustomInput>
					<Button className=" offset-md-1 col-md-1" type="button" id="addModule" style={{ backgroundColor: "blueviolet" }} onClick={() => setMod(!modToggle)}>{modToggle ? <strong>➖</strong> : <strong>➕</strong>}</Button>
				</FormGroup>
				{modToggle ?
					<FormGroup className="row">
						<Input
							className="offset-md-3 col-md-8"
							type="text"
							name="newMod"
							id="newMod"
							placeholder="Add new module here"
							onChange={addModule}
						/>
					</FormGroup> : <span></span>}
				<FormGroup className="row">
					<Label for="title" className="col-md-3">
						Title
					</Label>
					<Input
						className="col-md-8"
						type="text"
						name="title"
						id="title"
						placeholder="Title for the video"
						onChange={handleChange}
						required
					/>
				</FormGroup>
				<FormGroup className="row">
					<Label for="desc" className="col-md-3">
						Description
					</Label>
					<Input
						className="col-md-8"
						type="textarea"
						name="desc"
						id="exampleText"
						placeholder="Add Description"
						onChange={handleChange}
						required
					/>
				</FormGroup>
				<FormGroup className="row">
					<Label for="videofile" className="col-md-3">
						Video File
					</Label>
					<CustomInput
						className="col-md-8"
						type="file"
						id="videofile"
						name="video"
						label="Yo, pick a file!"
						accept="video/*"
						onChange={handleVideo}
						required
					/>
				</FormGroup>
				<FormGroup className="row" >
					<Label for="addresources" className="col-md-3">
						Additional Resources
					</Label>
					<CustomInput
						className="col-md-8"
						type="file"
						id="file"
						name="file"
						label="Yo, pick a file!"
						onChange={handleFile}
					/>
				</FormGroup>
				<Row className="offset-md-3 ">
					<Button
						style={{ backgroundColor: "green" }}
						className="offset-md-2 col-md-6"
						onSubmit={handleUpload}
					>
						Upload
					</Button>
				</Row>
				<hr />
				<div>
					<Progress animated style={{ backgroundColor: "blueviolet" }} value={progress}>
						{progress}%
					</Progress>
				</div>
				<hr />
			</Container>
		</Form>
		// </ProfileIsLoaded>
	);

}

const MapStateToProps = (state) => {
	console.log(state)
	return {
		profile: state.firebase.profile,
		auth: state.firebase.auth,
		firebase: state.firebase
	};
};

export default connect(MapStateToProps)(Upload);
