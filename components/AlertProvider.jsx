'use client'
import { createContext, useState } from 'react';
import { Alert, Typography } from '@material-tailwind/react';
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon
} from "@heroicons/react/24/solid";

export const AlertContext = createContext();

const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    type: "error",
    message: ""
  });
  const [open, setOpen] = useState(false);

  return (
    <AlertContext.Provider value={{ setOpen, setAlert }}>
      <div className="z-50 fixed bottom-4 left-4">
        <Alert
          variant="outlined"
          color={alert?.type === "error" ? "red" : "green"}
          open={open}
          icon={
            alert?.type === "error" ?
            <ExclamationTriangleIcon className="h-6 w-6" />
            :
            <CheckCircleIcon className="h-6 w-6"/>
          }
          onClose={() => setOpen(false)}
          className="bg-white"
        > 
          <Typography className="font-medium">
            { alert?.message }
          </Typography>
        </Alert>
      </div>
      { children }
    </AlertContext.Provider>
  )
}

export default AlertProvider;