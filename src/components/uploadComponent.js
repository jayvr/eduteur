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
	Progress,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Alert
} from 'reactstrap';
import { getFirestore } from 'redux-firestore';
import { useFirebase, isLoaded } from 'react-redux-firebase';
import Loading from "./LoadingComponent";
import { FiPlus, FiMinus, FiChevronUp, FiChevronDown } from "react-icons/fi"
import "../App.css";

function Upload(props) {
	const [subjectItems, setSubjectItems] = useState(() => { const prof = props.profile.subjects; return prof });
	const [moduleItems, setModuleItems] = useState([{ id: "0", name: "select the subject" }]);
	const [latestItems, setLatestItems] = useState({ one: {}, two: {}, three: {} });
	const [formData, setformData] = useState({
		college: props.profile.college,
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
	const [selectedSubject, setSelectedSubject] = useState("Subjects");
	const [selectedModule, setSelectedModule] = useState("Modules");
	const [isFirstModule, setFirstModule] = useState(false);
	const [newModule, setNewModule] = useState({ name: "", id: 1 });
	const [isUploaded, setUploaded] = useState(false);
	const [showProgress, setProgressBar] = useState(false);

	const [video, setVideo] = useState(null)
	const [file, setFile] = useState(null)

	const [progress, setProgress] = useState(0);
	// const [dropdownOpen, setDropdownOpen] = useState(false);

	// const toggle = () => setDropdownOpen((prevState) => !prevState);
	const [modToggle, setMod] = useState(false);
	const [linkToggle, setLink] = useState(false);

	const firebase = useFirebase();
	const firestore = getFirestore();


	const DropdownBtn = (props) => {
		const [items, setItems] = useState(props.items);
		const [header, setHeader] = useState(props.header);

		const [dropdownOpen, setDropdownOpen] = useState(false);
		const toggle = () => setDropdownOpen(prevState => !prevState);

		let toggleClass = "subject-toggle";
		let toggleDrop = "subject-drop";

		if (props.from === "module") {
			toggleClass = "module-toggle";
			toggleDrop = "module-drop";
		}

		const fetcher = (e) => {
			console.log("inside fetcher")
			if (props.from === "subject") {
				setSelectedSubject(e.target.value);
				handleSubject(e)
			} else if (props.from === "module") {
				handleModule(e)
			}
		}


		return (
			<Dropdown isOpen={dropdownOpen} toggle={toggle}>
				<DropdownToggle id={toggleClass}>
					{header}
					{dropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
				</DropdownToggle>
				<DropdownMenu id={toggleDrop}>
					{items &&
						items.map((item, index) => (
							<DropdownItem key={index} id={index} value={item.name} onClick={fetcher} >{item.name}</DropdownItem>
						))
					}
				</DropdownMenu>
			</Dropdown>
		)
	}
	// extract the modules form the selected subject field
	const handleSubject = (e) => {
		const index = e.target.id;
		const semester = "sem" + subjectItems[index].sem;
		const branch = subjectItems[index].branch;

		setformData({
			...formData,
			subject: e.target.value,
			branch: branch,
			sem: semester,
		})

		const path = `${props.profile.college}/${semester}/${branch}/${e.target.value}`;
		console.log("path to subject: " + path)

		firestore.doc(path).get()
			.then((doc) => {
				if (doc.exists) {
					if (doc.data().latest != null) {
						setLatestItems(doc.data().latest)
					}
					if (doc.data().modules != null) {
						setModuleItems(doc.data().modules);
						console.log(moduleItems);
					}
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

		setSelectedModule(e.target.value)
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
		if (linkToggle) {
			setVideo(e.target.files[0]);
		} else {
			setVideo(e.target.value);
		}
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

		const fullpath = `${formData.college}/${formData.sem}/${formData.branch}/${formData.subject}/${formData.module}/`;
		const path = `${formData.college}/${formData.sem}/${formData.branch}`

		console.log(fullpath);
		console.log(path);

		(async () => {
			if (linkToggle) {
				VideoURL = await fileUploader(fullpath, video, videoName);
				console.log("Video URL: " + VideoURL);
			} else {
				VideoURL = video;
				console.log("Video URL: " + VideoURL);
			}

		})().then(async () => {
			if (file != null) {
				FileURL = await fileUploader(fullpath, file, fileName);
				console.log("File URL: " + FileURL);
			}
		}).then(async () => {
			console.log('Creating Document...');
			// make a new doc for every new discussion question
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
					console.log(res.id)
					console.log('Document is created');
					const currentData = {
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
						videoURL: VideoURL,
						docID: res.id,
					}

					const newLatest = {
						one: currentData,
						two: latestItems.one,
						three: latestItems.two
					}
					firestore.collection(`${path}`).doc(`${formData.subject}`).set({
						latest: newLatest,
					}, { merge: true }).then(() => {
						console.log("updated latest")
						if (formData.isNewModule) {
							console.log("Updating module MBR")
							firestore.collection(`${path}`).doc(`${formData.subject}`).set({
								latest: newLatest,
								modules: firebase.firestore.FieldValue.arrayUnion({
									id: formData.moduleID,
									name: formData.module
								})
							}, { merge: true }).then(() => {
								console.log("Modules updated")
								document.getElementById("upload-form").reset();
							})
						}
						document.getElementById("upload-form").reset();

					})
					// update the MBR if new module is added

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
		<>
			{props.auth.uid && props.profile.role == "faculty" ?
				<>
					<Form className="upload-form" id="upload-form" onSubmit={handleUpload}>
						<Container>
							<h1 id="form-heading">Upload Module / Materials</h1>
							<hr />
							<FormGroup className=" row">
								<Label for="selectSubject" style={{ marginTop: "20px" }} className="col-md-3">Subject</Label>
								<DropdownBtn header={selectedSubject} items={subjectItems} from="subject" required data-error="Subject is Required." />
							</FormGroup>
							<FormGroup className="row">
								<Label for="selectModule" className="col-md-3">Module</Label>
								<Button type="button"
									id={!modToggle ? "addModule" : "selectModule"}
									onClick={() => setMod(!modToggle)}>
									{modToggle ? <FiMinus /> : <FiPlus />}
								</Button>
								{modToggle ?
									<Input
										className="col-7"
										type="text"
										name="newMod"
										id="newMod"
										placeholder="Add new Module"
										onChange={addModule}
										required="true"
									/>
									:
									<DropdownBtn header={selectedModule} items={moduleItems} from="module" required data-error="module is Required." />
								}

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
									required="true"
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
									required="true"
								/>
							</FormGroup>
							<FormGroup className="row">
								<Label for="videofile" className="col-md-3">
									Video File
					</Label>
								{!linkToggle ?
									< Input
										className="col-md-6"
										type="file"
										id="video-file"
										name="video"
										accept="video/*"
										onChange={handleVideo}
										required="true"
									/> :
									<Input
										className="col-md-6"
										type="url"
										id="video-file"
										placeholder="Paste URL"
										name="video"
										onChange={handleVideo}
									/>}
								<Button className="offset-1 col-md-1" type="button" id="addModule" onClick={() => setLink(!linkToggle)}>					{linkToggle ? "Link" : "Video"}
								</Button>
							</FormGroup>
							<FormGroup className="row" >
								<Label for="addresources" className="col-md-3">
									Additional Resources
					</Label>
								<Input
									className="col-md-8"
									type="file"
									id="add-file"
									name="file"
									onChange={handleFile}
								/>
							</FormGroup>
							<Row className="offset-md-4">
								<Button
									className=""
									id="upload-btn"
									onSubmit={handleUpload}
								>
									Upload
					</Button>
							</Row>
							<hr />
							<div>
								<>
									{
										progress === 100 ?
											<Alert color="primary">
												Uploaded
		  									</Alert>
											: progress === 0 ?
												<> </>
												:
												<Progress animated
													style={{ backgroundColor: "#009e60", color: "#111" }}
													value={progress}>
													{progress}%
												</Progress>
									}
								</>
							</div>
							<hr />
						</Container>
					</Form >
				</>
				:
				<>
					{window.location.replace("http://localhost:3000/")}
				</>
			}
		</>
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
