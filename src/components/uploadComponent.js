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
	const [moduleItems, setModuleItems] = useState([{ id: '1', name: 'please select the subject first', ref: '' }]);
	const [formData, setformData] = useState({
		title: "",
		desc: "",
		module: "",
		subject: "",
		author: "",
		sem: "",
		branch: "",
		uid: ""
	})
	const [video, setVideo] = useState(null)
	const [file, setFile] = useState(null)


	const [fullPath, setFullPath] = useState(null);
	const [tempPath, setTempPath] = useState(null);


	const [progress, setProgress] = useState(0);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const toggle = () => setDropdownOpen((prevState) => !prevState);

	const firebase = useFirebase();
	const firestore = getFirestore();



	const handleSubject = (e) => {
		// console.log(e.target.id);
		const index = e.target.id;
		const path = e.target.value;
		setTempPath(path);
		// tempPath = e.target.value;
		// console.log(tempPath);

		setformData({
			...formData,
			subject: e.target.name,
			branch: subjectItems[index].branch,
			sem: "sem" + subjectItems[index].sem,
		})
		firestore
			.doc(path)
			.get()
			.then((doc) => {
				if (doc.exists) {
					setModuleItems(doc.data().modules);
					console.log(moduleItems);
				} else {
					// doc.data() will be undefined in this case
					console.log('No such document!');
				}
			})
			.catch((error) => {
				console.log('Error getting document:', error);
			});
	};

	const handleTopicPath = (e) => {
		console.log("INside handleTopicPath")
		setformData({
			...formData,
			module: e.target.value
		})
		const path = tempPath + '/' + e.target.value + "/";
		console.log(path);
		setFullPath(path);
		console.log("left handleTopicPath")
	};

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

	const handleVideo = (e) => {
		// console.log(e.target.files[0]);
		setVideo(e.target.files[0]);
	};

	const handleFile = (e) => {
		// console.log(e.target.files[0]);
		setFile(e.target.files[0]);
	};

	async function fileUploader(path, file) {
		var downURL = null;
		return new Promise((resolve, reject) => {
			console.log("Uploading...");
			const storageRef = firebase.storage().ref(`${fullPath}${file.name}`).put(file)
			storageRef.on("state_changed",
				snapshot => {
					const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
					setProgress(prog);
				},
				error => {
					console.log(error);
					reject(error);
				},
				async () => {
					downURL = await storageRef.snapshot.ref.getDownloadURL()
					console.log("upload success");
					resolve(downURL);
				});
		});
	}

	async function handleUpload() {

		var VideoURL = null;
		var FileURL = null;
		console.log(formData);
		console.log(video);
		console.log(file);
		console.log(fullPath);
		(async () => {
			VideoURL = await fileUploader(fullPath, video);
			console.log("Video URL: " + VideoURL);
		})().then(async () => {
			FileURL = await fileUploader(fullPath, file);
			console.log("File URL: " + FileURL);
		}).then(async () => {
			console.log('Creating Document...');
			await firestore.collection(`${fullPath}`)
				.add({
					title: formData.title,
					dec: formData.desc,
					branch: formData.branch,
					createdAt: new Date(),
					module: '1',
					moduleName: formData.module,
					sem: formData.sem,
					subject: formData.subject,
					author: formData.author,
					uid: formData.uid,
					fileURL: FileURL,
					videoURL: VideoURL
				})
				.then((res) => {
					console.log('Upadted in DOC');
				})
				.catch((error) => {
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
		<Form>
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
					<CustomInput type="select" className="col-md-8" id="module" name="module" onChange={handleTopicPath}>
						<option value="">Select the module</option>
						{
							moduleItems.map((item) => (
								<option key={item.id} value={item.name} name="module">
									{item.name}
								</option>
							))
						}
					</CustomInput>
				</FormGroup>
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
						onClick={handleUpload}
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
