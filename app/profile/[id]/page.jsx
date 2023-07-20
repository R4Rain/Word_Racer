"use client"
import { useEffect, useState, useRef, useContext } from 'react';
import { 
  Alert,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography
} from "@material-tailwind/react";

import { useSearchParams } from 'next/navigation';
import { XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useSession } from 'next-auth/react';
import { Formik, Field, ErrorMessage, Form as FormikForm } from 'formik';
import { AlertContext } from '@components/AlertProvider';
import { uploadFiles } from "@utils/uploadthing";
import Error from '@components/Error';
import ProfileMain from '@components/Profile/ProfileMain';
import LoadingSplash from '@components/LoadingSplash';

const Profile = ({ params }) => {
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const maxFileSize = 4 * 1024 * 1024; // 4MB in bytes

  const { id } = params;
  const {data: session, update: updateSession} = useSession();
  const searchParams = useSearchParams();
  const fileRef = useRef(null);

  const [edit, setEdit] = useState(searchParams.get("edit") === "1");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingRecord, setLoadingRecord] = useState(true);
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  
  const [numTest, setNumTest] = useState(0);
  const [avgWPM, setAvgWPM] = useState(0);
  const [avgAcc, setAvgAcc] = useState(0);
  const [numWords, setNumWords] = useState(0);
  const [highestWPM, setHighestWPM] = useState(0);
  const [currRank, setCurrRank] = useState(0);

  const {setAlert, setOpen} = useContext(AlertContext);
  const [alertForm, setAlertForm] = useState("");
  const [openAlertForm, setOpenAlertForm] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUploadSrc, setImageUploadSrc] = useState(null);
  const [errorFetch, setErrorFetch] = useState(false);

  const statsDesc = [
    {title: "Number of test taken", color: "bg-blue-gray-100/50 text-blue-gray-600", value: numTest},
    {title: "Average WPM", color: "bg-green-100/50 text-green-600", value: avgWPM},
    {title: "Average accuracy", color: "bg-blue-100/50 text-blue-600", value: avgAcc},
    {title: "Number of word typed", color: "bg-teal-100/50 text-teal-600", value: numWords},
    {title: "Highest WPM", color: "bg-amber-100/50 text-amber-600", value: highestWPM},
    {title: "Current rank", color: "bg-indigo-100/50 text-indigo-600", value: currRank}
  ];

  const calculateTotal = (data, label) => {
    return data.reduce((sum, obj) => sum + obj[label], 0);
  }

  const calculateAverage = (data, label) => {
    const total = calculateTotal(data, label);
    const avg = (data.length > 0 ? total / data.length : 0);
    return avg.toFixed(2);
  }

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${id.toString()}`);
      const data = await response.json();
      if(response.ok) {
        setUser(data);
      } else {
        setErrorFetch(true);
      }
      setLoadingProfile(false);
    };
  
    fetchUser();
  }, []);

  useEffect(() => {
    const updateStats = (data) => {
      setNumTest(data.length);
      setAvgWPM(calculateAverage(data, "wpm") || 0);
      setAvgAcc(`${calculateAverage(data, "accuracy")}%`);
      setNumWords(calculateTotal(data, "num_words"));
      setHighestWPM(user.highestWPM?.wpm || 0);
      setCurrRank(`#${user.rank}`);
    }

    const fetchRecord = async () => {
      const response = await fetch(`/api/users/${id.toString()}/records`);
      const { data } = await response.json();
      if(response.ok) {
        setRecords(data);
        updateStats(data);
        setLoadingRecord(false);
      }
    }
    if(user) {
      fetchRecord();
    }
  }, [user]);

  const closeEdit = () => {
    setEdit(false);
  };

  const openEdit = () => {
    setImageUpload(null);
    setImageUploadSrc(null);
    setEdit(true);
  }

  const handleSubmitEdit = async ({name, email}) => {
    try {
      let picture = null;
      if(imageUpload) {
        const responseUpload = await uploadFiles({
          files: [imageUpload],
          endpoint: "imageUploader"
        })
        const {fileKey, fileUrl} = responseUpload[0];
        picture = {
          url: fileUrl,
          key: fileKey
        }
      }
      const data = {name, email};
      if(picture) {
        data.picture = picture;
      }
      
      const response = await fetch(`/api/users/${id.toString()}`, {
        method: "PATCH",
        body: JSON.stringify(data)
      });

      if(response.ok) {
        setUser({...user, ...data});
        await updateSession({
          ...session,
          user: {...session?.user, ...data}
        });
        setAlert({
          type: "success",
          message: "Profile has been updated"
        })
        setOpen(true);
        setEdit(false);
      } else {
        const { error } = await response.json();
        setAlertForm(error);
        setOpenAlertForm(true);
      }
    } catch(error) {
      setAlertForm("Internal server error");
      setOpenAlertForm(true);
    }
  }

  const handleUploadButtonClick = () => {
    fileRef.current.click();
  }

  const handleFileChange = () => {
    const file = fileRef.current.files[0];
    if(file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if(file.size <= maxFileSize && allowedExtensions.includes(fileExtension)) {
        setOpenAlertForm(false);
        setImageUpload(file);
        const reader = new FileReader();
        reader.onload = (onLoadEvent) => {
          setImageUploadSrc(onLoadEvent.target.result);
        }
        reader.readAsDataURL(file);
      } else {
        setAlertForm("File must be an image type (jpg, jpeg, png, gif) up to 4MB");
        setOpenAlertForm(true);
      }
    }
  }
  
  if(loadingProfile) return <LoadingSplash/>
  else if(errorFetch) return <Error/>

  return (
    <section className="mx-12 my-20 flex flex-col justify-center gap-4 relative">
      <Dialog open={edit}>
        <Formik
          initialValues={{
            name: user.name,
            email: user.email
          }}
          validate={values => {
            const errors = {};
            if(!values.name) {
              errors.name = "Name is required";
            }

            if(!values.email) {
              errors.email = "Email is required";
            } else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
              errors.email = "Invalid email address";
            }
            return errors;
          }}
          onSubmit={(values, {setSubmitting}) => {
            setTimeout(async() => {
              await handleSubmitEdit(values);
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => {
            const profileImage = user?.picture?.url ? user.picture.url  : "/assets/default.png";
            return (
              <FormikForm>
                <div className="flex items-center justify-between">
                  <DialogHeader>Edit Profile</DialogHeader>
                  <IconButton className="mr-3" variant="text" color="blue-gray" onClick={closeEdit} disabled={isSubmitting} ripple={false}>
                    <XMarkIcon className="h-full w-full"/>
                  </IconButton>
                </div>
                <DialogBody divider>
                  <div className="flex flex-col items-center justify-center gap-4 mb-6">
                    <div className="w-40 h-40">
                      <Avatar
                        src={imageUploadSrc ? imageUploadSrc : profileImage}
                        alt="Profile picture"
                        variant="circular"
                        className="w-full h-full bg-blue-gray-50 border border-blue-gray-100"
                      />
                    </div>
                    <div>
                      <Button variant="outlined" color="blue-gray" size="sm" onClick={handleUploadButtonClick}>Upload image</Button>
                      <input type="file" ref={fileRef} name="user-profile" className="hidden" onChange={handleFileChange}/>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <Alert 
                      variant="outlined" 
                      color="red" 
                      open={openAlertForm} 
                      onClose={() => setOpenAlertForm(false)}
                      icon={<ExclamationTriangleIcon strokeWidth={2} className="h-6 w-6" />}
                    >
                      { alertForm }
                    </Alert>
                    <div>
                    <Typography variant="small" color="blue-gray">Name</Typography>
                    <Field type="text" name="name" className="input_block mb-1"/>
                    <Typography variant="small" color="red">
                      <ErrorMessage name="name" component="span"/>
                    </Typography>
                    </div>
                    <div>
                      <Typography variant="small" color="blue-gray">Email</Typography>
                      <Field type="text" name="email" className="input_block mb-1"/>
                      <Typography variant="small" color="red">
                        <ErrorMessage name="email" component="span"/>
                      </Typography>
                    </div>
                  </div>
                </DialogBody>
                <DialogFooter className="space-x-2">
                  <Button type="submit" variant="outlined" color="green" disabled={isSubmitting}>
                    { isSubmitting ? "Loading..." : "Save" }
                  </Button>
                </DialogFooter>
              </FormikForm>
          )}}
        </Formik>
      </Dialog>
      <ProfileMain loadingProfile={loadingProfile} loadingRecord={loadingRecord} session={session} openEdit={openEdit} user={user} stats={statsDesc} records={records}/>
    </section>
  )
}

export default Profile