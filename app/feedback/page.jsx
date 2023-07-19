"use client"
import { useState, useContext } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Textarea, Typography } from '@material-tailwind/react';
import { AlertContext } from '@components/AlertProvider';

const Feedback = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const {setAlert, setOpen} = useContext(AlertContext);

  const handleChange = (e) => {
    setMessage(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!message) return;
    
    setSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify({ message })
      });

      if(response.ok) {
        setAlert({
          type: "success",
          message: "Successfully sent a feedback"
        })
        setOpen(true);
        setMessage("");
      }
    } catch(error) {
      console.log(error);
    }
    setSubmitting(false);
  }

  return (
    <section className="w-full relative lg:px-24 px-10 py-12">
      <div className="mx-auto rounded-xl shadow-sm border-2 border-blue-gray-50 max-w-7xl">
        <Card className="w-full h-full">
          <CardHeader floated={false} shadow={false} className="rounded-none mb-2">
            <div className="ml-2">
              <Typography variant="h2" color="blue-gray" className="font-extrabold tracking-tight leading-none">
                Send us some feedback
              </Typography>
              <Typography variant="paragraph" color="gray" className="mt-1 font-light">
                Found a bug? Have a suggestion? Fill out the form below and we'll take a look!
              </Typography>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardBody>
              <div>
                <Textarea label="Message" value={message} onChange={handleChange}/>
              </div>
            </CardBody>
            <CardFooter className="pt-0">
              <Button type="submit" variant="gradient" color="blue" disabled={isSubmitting || message.length === 0}>
                { isSubmitting ? "Loading..." : "Submit" }
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </section>
  )
}

export default Feedback