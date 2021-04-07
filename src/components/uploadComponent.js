import React, { useState } from 'react';
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
import { useFirebase } from 'react-redux-firebase';

function Upload(props) {
	const [ subjectItems, setSubjectItems ] = useState(props.data.subjects);
	const [ moduleItems, setModuleItems ] = useState([ { id: '1', name: 'please select the subject first', ref: '' } ]);
	const [ file, setFile ] = useState(null);
	const [ video, setVideo ] = useState(null);
	const [ progress, setProgress ] = useState(0);
	const firebase = useFirebase();
	const firestore = getFirestore();

	// [{id: "1", name:"Loading...", ref:""}]

	const handleSubmit = (e) => {
		// console.log(e.target.value)
		const path = e.target.value;
		firestore
			.doc(path)
			.get()
			.then((doc) => {
				if (doc.exists) {
					console.log(doc.data().modules);
					setModuleItems(doc.data().modules);
					// console.log("Document data:", moduleItems);
				} else {
					// doc.data() will be undefined in this case
					console.log('No such document!');
				}
			})
			.catch((error) => {
				console.log('Error getting document:', error);
			});
	};

	const DropdownBtn = (props) => {
		const [ dropdownOpen, setDropdownOpen ] = useState(false);
		const [ items, setItems ] = useState(props.items);
		const [ header, setHeader ] = useState(props.header);
		const toggle = () => setDropdownOpen((prevState) => !prevState);
		return (
			<Dropdown isOpen={dropdownOpen} toggle={toggle}>
				<DropdownToggle style={{ backgroundColor: 'blueviolet', color: 'white' }} caret>
					{header}
				</DropdownToggle>
				<DropdownMenu>
					{items.map((item) => (
						<DropdownItem key={item.id} value={item.path} onClick={handleSubmit}>
							{item.name}
						</DropdownItem>
					))}
				</DropdownMenu>
			</Dropdown>
		);
	};

	const handleVideo = (e) => {
		console.log(e.target.files[0]);
		setVideo(e.target.files[0]);
	};

	const handleFile = (e) => {
		console.log(e.target.files[0]);
		setFile(e.target.files[0]);
	};

	// async function fileUploader(path, file){
	//     var downURL = null;
	//     console.log("Uploading...");
	//     const storageRef = firebase.storage().ref(`${path}${file.name}`).put(file)
	//     storageRef.on("state_changed",
	//     snapshot => {
	//         const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
	//         setProgress(prog);
	//     },
	//     error => {
	//         console.log(error);
	//     },
	//     () => {
	//         downURL = await storageRef.snapshot.ref.getDownloadURL()
	//         // .then(url =>{
	//         //     console.log(url);
	//         //     // setUrl(url);
	//         //     // downURL = url;
	//         //     return downURL;
	//         //     console.log("Down URL in function:" + downURL);
	//         // })
	//         console.log(downURL);
	//         console.log("upload success");
	//         return downURL;
	//     });
	// }

	const handleUpload = () => {
		const storageVideoRef = firebase.storage().ref(`LJ/sem1/ict/python/${video.name}`).put(video);
        var videoURL = null;
        var fileURL = null;
		storageVideoRef.on(
			'state_changed',
			(snapshot) => {
				const prog = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
				setProgress(prog);
			},
			(error) => {
				console.log(error);
			},
			() => {
				storageVideoRef.snapshot.ref.getDownloadURL().then((url) => {
					// setVideoUrl(url);
                    videoURL = url;
					console.log('VideoURL:' + url);
					const storageFileRef = firebase.storage().ref(`LJ/sem1/ict/python/${file.name}`).put(file);
					storageFileRef.on(
						'state_changed',
						(snapshot) => {
							const prog = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
							setProgress(prog);
						},
						(error) => {
							console.log(error);
						},
						() => {
							storageFileRef.snapshot.ref.getDownloadURL().then((url) => {
								// setFileUrl(url);
                                fileURL = url;
								console.log('FileURL:' + url);
								console.log('Creating Document...');
								firestore
									.collection('LJ/sem1/ict/python/topics')
									.add({
										title: 'for loop',
										dec: 'looping with for',
										branch: 'ict',
										createdAt: new Date(),
										module: '1',
										moduleName: 'Array through loops',
										sem: '1',
										subject: 'python',
										fileURL: fileURL,
										videoURL: videoURL
									})
									.then((res) => {
										console.log('Connected with DOC' + res);
									})
									.catch((error) => {
										console.log(error);
									});
							});
						}
					);
					console.log('upload success');
				});
			}
		);
	};

	return (
		<Form>
			<Container>
				<h1>Upload/Go Live</h1>
				<hr />
				<FormGroup className=" row offset-md-3">
					<div className="col-md-4">
						<DropdownBtn header="Subjects" items={subjectItems} />
					</div>
					<div className="col-md-4">
						<DropdownBtn header="Modules" items={moduleItems} />
					</div>
				</FormGroup>
				<FormGroup className="row">
					<Label for="title" className="col-md-3">
						Title
					</Label>
					<Input className="col-md-8" type="text" name="title" id="title" placeholder="Title for the video" />
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
						name="customFvideofileile"
						label="Yo, pick a file!"
						onChange={handleVideo}
					/>
				</FormGroup>
				<FormGroup className="row">
					<Label for="addresources" className="col-md-3">
						Additional Resources
					</Label>
					<CustomInput
						className="col-md-8"
						type="file"
						id="file"
						name="videofile"
						label="Yo, pick a file!"
						onChange={handleFile}
					/>
				</FormGroup>
				<Row className="offset-md-3 ">
					<Button
						style={{ backgroundColor: 'green' }}
						className="offset-md-2 col-md-6"
						onClick={handleUpload}
					>
						Upload
					</Button>
				</Row>
				<hr />
				<div>
					<Progress animated color="info" value={progress}>
						{progress}%
					</Progress>
				</div>
				<hr />
			</Container>
		</Form>
	);
}

const MapStateToProps = (state) => {
	// console.log(state)
	return {
		data: state.firebase.profile,
		auth: state.firebase.auth,
		firebase: state.firebase
	};
};

export default connect(MapStateToProps)(Upload);
