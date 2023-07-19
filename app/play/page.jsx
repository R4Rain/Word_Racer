"use client"
import { useRef, useEffect, useState, useContext } from 'react';
import { Button, IconButton, Input, Typography } from "@material-tailwind/react"
import { PlayIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import UserRecord from '@components/UserRecord';
import ResultDialog from '@components/ResultDialog';
import { calculateWPM, calculateAccuracy } from '@utils/tools';
import { useSession } from 'next-auth/react';
import { AlertContext } from '@components/AlertProvider';

const Play = () => {
  const COUNT_DOWN = 5;
  const TIME_LIMIT = 150;
  const MAX_LENGTH = 32;
  const {setAlert, setOpen} = useContext(AlertContext);
  const {data: session, status: sessionStatus} = useSession();
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);

  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [fetchData, setFetchData] = useState(false);
  const [textLoading, setTextLoading] = useState(false);
  const [startCountDown, setStartCountDown] = useState(0);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0);

  // Variables for the typing test
  const [charIndex, setCharIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [charStatus, setCharStatus] = useState([]);
  const [words, setWords] = useState("");
  const [warning, setWarning] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
 
  // For result menu
  const [openResult, setOpenResult] = useState(false);
  const [failed, setFailed] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  
  useEffect(() => {
    const fetchQuote = async () => {
      setTextLoading(true);
      const response = await fetch('/api/quotes');
      const { desc } = await response.json();
      if(response.ok) {
        setWords(desc);
        setTextLoading(false);
      }
    };
    if(fetchData) {
      fetchQuote();
    }
  }, [fetchData]);

  useEffect(() => {
    const fetchRecord = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/records`);
      const { data } = await response.json();
      if(response.ok) {
        setRecords(data);
      }
      setLoadingRecords(false);
    }
    if(sessionStatus === "authenticated" && session?.user) {
      fetchRecord();
    }
  }, [session?.user, sessionStatus]);

  useEffect(() => {
    if(words) {
      const initial_array = new Array(words.length).fill(-1);
      setCharStatus(initial_array);
    }
  }, [words]);

  useEffect(() => {
    let timeLimit;
    if(status === "playing") {
      if(inputRef.current) {
        inputRef.current.querySelector('input').focus();
      }
      timeLimit = setInterval(() => {
        setTime((prev) => {
          if(prev >= TIME_LIMIT) {
            clearInterval(timeLimit)
            setStatus("finished")
            return TIME_LIMIT
          } else {
            return prev + 1
          }
        })
      }, 1000);
    }

    else if(status === "completed") {
      clearInterval(timeLimit);
      setFailed(false);
      setOpenResult(true);
    }

    else if(status === "finished") {
      clearInterval(timeLimit);
      setFailed(true);
      setOpenResult(true);
    }

    return () => clearInterval(timeLimit);
  }, [status]);

  const resetGame = () => {
    setCharIndex(0);
    setWordIndex(0);
    setWarning(false);
    setInput("");
    setCorrect(0);
    setWrong(0);
    setTime(0);
    setProgress(0);
  }

  const start = () => {
    setStartCountDown(COUNT_DOWN);
    setFetchData(true);
    resetGame();

    const interval = setInterval(() => {
      setStartCountDown((prev) => {
        if(prev === 0) {
          clearInterval(interval);
          setFetchData(false);
          setStatus("playing");
          return 0;
        } else {
          return prev - 1;
        }
      })
    }, 1000);
  };

  const TextCharacter = ({char, index}) => {
    return (
      <span 
        className={`
          ${charStatus[index] === 1 ? "text-green-600" : ""} 
          ${charStatus[index] === 0 ? "bg-red-300" : ""}`
        }
      >
        {char}
      </span>
    )
  }

  const handleInput = (e) => {
    const currString = e.target.value;
    if(currString.length > MAX_LENGTH) {
      setWarning(true);
      return;
    }
    setWarning(false);
    let isCorrect = true;
    let char_correct = 0;
    let word_correct = 0;
    let last_space = 0;

    for(let idx = 0;idx < currString.length && idx < words.length; idx++) {
      if(currString.charAt(idx) !== words.charAt(charIndex + idx)) {
        isCorrect = false;
        break;
      }
      if(currString.charAt(idx) === " ") {
        last_space = idx + 1;
        word_correct = word_correct + 1;
      }
      char_correct = idx + 1;
    }
    // remaining input
    const remaining = currString.substring(last_space);
    // update char status
    const currStatus = charStatus;
    currStatus.fill(1, charIndex, charIndex + char_correct); // correct
    currStatus.fill(0, charIndex + char_correct, charIndex + currString.length); // wrong
    currStatus.fill(-1, charIndex + currString.length, charIndex + MAX_LENGTH); // n.a
    setProgress((charIndex + char_correct) / words.length * 100); // progress
    setCharIndex(charIndex + last_space); // switch index
    setWordIndex(wordIndex + word_correct);
    setCharStatus(currStatus);
    if(currString.length > input.length) { // if only there is a new character
      isCorrect ? setCorrect(correct + 1) : setWrong(wrong + 1);
    }
    setInput(remaining);
    // If finished
    if(charIndex + char_correct >= words.length) {
      setStatus("completed");
    }
  }

  const handleRenderText = () => {
    let index = 0;
    const curr_words = words.split(" ");
    const res = curr_words.map((word, word_index) => {
      const letters = word.split("");
      const results = letters.map((char) => {
        const curr_index = index;
        index = index + 1;
        return <TextCharacter key={index} char={char} index={curr_index} />
      })
      const space_index = index;
      index = index + 1;
      return (
        <span key={word_index}>
          <span className={`${wordIndex === word_index ? "bg-gray-300 outline-gray-500 rounded-sm outline" : ""}`}>
            {results}
          </span>
          {word_index !== curr_words.length - 1 && (
            <TextCharacter char={" "} index={space_index} />
          )}
        </span>
      )
    })
    return res;
  }

  const handleSave = async () => {
    setDisableButton(true)
    try {
      const wpm = calculateWPM(time, wordIndex);
      const accuracy = calculateAccuracy(correct, wrong);
      const userId = session?.user.id;
      const response = await fetch('/api/records/new', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          wpm,
          accuracy,
          num_words: wordIndex
        })
      })
      if(response.ok) {
        setRecords([{
          createdOn: new Date(),
          user: userId,
          wpm,
          accuracy,
          num_words: wordIndex
        }, ...records]);
        setAlert({
          type: "success",
          message: "Successfully added a new record"
        })
        setOpen(true);
      } else {
        setAlert({
          type: "error",
          message: "Internal server error, please try later"
        })
        setOpen(true);
      }
    } catch(error) {
      console.log(error)
    } finally {
      setDisableButton(false)
      setOpenResult(false)
      setStatus("idle")
    }
  }

  const handleRetry = () => {
    setDisableButton(true)
    setStatus("idle")
    setOpenResult(false)
    start()
    setDisableButton(false)
  }

  const handleLeave = () => {
    setDisableButton(true)
    setStatus("idle")
    setOpenResult(false)
    setFetchData(false)
    setDisableButton(false)
  }

  return (
    <section className="w-full relative">
      <ResultDialog 
        open={openResult} 
        handleSave={handleSave}
        handleRetry={handleRetry} 
        handleLeave={handleLeave} 
        wpm={calculateWPM(time, wordIndex)} 
        time={time} 
        accuracy={calculateAccuracy(correct, wrong)} 
        disableButton={disableButton}
        failed={failed}
        authStatus={sessionStatus}
      />
      <div className="px-5 py-6 lg:px-24 lg:py-10">
        <div className="grid mx-auto gap-4 lg:grid-cols-12">
          <div className="w-full h-fit px-6 pt-6 pb-7 bg-white rounded-xl shadow-sm border-2 border-blue-gray-50 mr-auto lg:col-span-8">
            {
              status === "idle" ?
              <div className="mb-10 w-full h-full flex flex-col items-center justify-center gap-2">
                <img
                  src={fetchData ? "/assets/loading.gif" : "/assets/idle.svg"}
                  alt={fetchData ? "Loading" : "Idle"}
                  className="md:w-[350px] lg:w-[550px] h-[550px] object-contain"
                />
                <Typography variant="lead" className="text-md text-center italic font-light text-gray-500 max-w-[75%]">
                  { fetchData ? `Get ready in ${startCountDown}...` : "Press the start button to start the typing test" }
                </Typography>
              </div>
              :
              (
                textLoading ?
                <div className="w-full h-full animate-pulse lg:min-h-[300px] mb-10" role="status">
                  <div className="h-8 rounded-full bg-gray-200 w-full mb-4"/>
                  <div className="h-6 rounded-full bg-gray-200 w-full mb-4"/>
                </div>
                :
                <div className="w-full h-full lg:min-h-[300px] mb-10">
                  <div className="flex flex-row justify-around gap-6 mb-4">
                    <div className="text-center">
                      <Typography variant="h4" className="text-2xl font-extrabold">Time</Typography>
                      <Typography variant="lead" className="text-gray-500 font-medium">{time < TIME_LIMIT ? `${TIME_LIMIT - time} s` : "Finished"}</Typography>
                    </div>
                    <div className="text-center">
                      <Typography variant="h4" className="text-2xl font-extrabold">Speed</Typography>
                      <Typography variant="lead" className="text-gray-500 font-light">{ calculateWPM(time, wordIndex) } WPM</Typography>
                    </div>
                    <div className="text-center">
                      <Typography variant="h4" className="text-2xl font-extrabold">Accuracy</Typography>
                      <Typography variant="lead" className="text-gray-500 font-light">{ calculateAccuracy(correct, wrong) } %</Typography>
                    </div>
                  </div>
                  <div className="w-full my-8">
                    <div className="bg-gray-300 relative h-[10px] w-full rounded-2xl">
                      <div className={`bg-blue-300 absolute top-0 left-0 h-full rounded-2xl`} style={{ width: `${ progress.toFixed(1) }%`}}>
                        <span className="bg-blue-300 absolute -right-[1.15rem] bottom-full mb-2 rounded-lg py-1 px-2 text-xs font-semibold text-white">
                          <span className="bg-blue-300 absolute bottom-[-2px] left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm"/>
                          { progress.toFixed(0) }{"%"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Typography 
                    variant="paragraph" 
                    className="lg:text-3xl md:text-2xl font-pt font-bold leading-loose tracking-wide select-none" 
                    color="blue-gray"
                  >
                    { handleRenderText() }
                  </Typography>
                </div>
              )
            }
            <div className="w-full mt-auto">
              { status === "idle" ?
                <Button 
                  className="mx-auto px-6 py-3 text-md font-bold flex items-center gap-3" 
                  ripple={false}
                  disabled={fetchData}
                  onClick={() => start()}
                >
                  <PlayIcon strokeWidth={2} className="h-6 w-6"/>
                  { fetchData ? "Loading..." : "Start" }
                </Button>
              :
                <div className="w-full">
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      ref={inputRef}
                      placeholder="Type the text here..."
                      className={`!text-lg ${warning ? "!border-red-400 !border-2 focus:!border-red-400" : "!border-blue-gray-200 focus:!border-blue-gray-200"}`}
                      labelProps={{
                        className: "before:content-none after:content-none"
                      }}
                      containerProps={{
                        className: "min-w-0"
                      }}
                      onChange={handleInput}
                      value={input}
                      onPaste={(e) => e.preventDefault()}
                      disabled={textLoading || !(status === 'playing')}
                      size="lg"
                    />
                    <IconButton variant="gradient" color="light-green" className="p-1" ripple={false} onClick={handleRetry}>
                      <ArrowPathIcon strokeWidth={2} className="w-6 h-6"/>
                    </IconButton>
                  </div>
                  { warning && (
                    <Typography variant="small" color="red" className="absolute top-auto">
                      The current word should be
                      <span className="font-bold">{" "}{`"${ words.split(" ")[wordIndex] }"`}</span>
                    </Typography>
                  )}
                </div>
              }
            </div>
          </div>
          <div className="w-full rounded-xl shadow-sm border-2 border-blue-gray-50 lg:col-span-4">
            <UserRecord records={records} title="Recent test" titleVariant="h5" loading={loadingRecords} requiredAuth={true} authStatus={sessionStatus}/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Play