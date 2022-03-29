import { callStatus } from '../minima/rpc-commands';
import { useState, useRef, useEffect } from 'react';
import { Button, Paper, TextField, TextareaAutosize } from '@mui/material';
import { useSnackbar } from 'notistack';

let commandHistoryIndex: any = -1;
let commandHistory: any = [];
let typedStuff = '';

const Terminal = () => {
    const [command, setCommand] = useState('');
    // const [typedStuff, setTypedStuff] = useState('');
    // const [commandHistory, setCommandHistory] = useState<string[]>([]);
    // const [commandHistoryIndex, setCommandHistoryIndex] = useState(-1);
    const [commandResponses, setCommandResponses] = useState<string[]>([]);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const buttonRef: any = useRef(null);

    useEffect(() => {
        callStatus().then(
            (data: any) => {
                console.log(data);
                if (data.status) {
                    const welcome = `
                     /$$      /$$ /$$           /$$                        
                    | $$$    /$$$|__/          |__/                        
                    | $$$$  /$$$$ /$$ /$$$$$$$  /$$ /$$$$$$/$$$$   /$$$$$$ 
                    | $$ $$/$$ $$| $$| $$__  $$| $$| $$_  $$_  $$ |____  $$
                    | $$  $$$| $$| $$| $$  \ $$| $$| $$ \ $$ \ $$  /$$$$$$$
                    | $$\  $ | $$| $$| $$  | $$| $$| $$ | $$ | $$ /$$__  $$
                    | $$ \/  | $$| $$| $$  | $$| $$| $$ | $$ | $$|  $$$$$$$
                    |__/     |__/|__/|__/  |__/|__/|__/ |__/ |__/ \_______/

                    Welcome to Minima. For assistance type help. Then press enter.`;
                    setCommandResponses((old) => [...old, welcome]);
                } else {
                    enqueueSnackbar('Minima Not Running', { variant: 'error' });
                }
            },
            (e) => {
                enqueueSnackbar('Minima Not Running', { variant: 'error' });
            }
        );
    }, []);

    useEffect(() => {
        if (buttonRef.current) {
            // @ts-ignore
            buttonRef.current.scrollIntoView({ behaviour: 'smooth' });
        }
    }, [commandResponses]);

    const onCallMinimaCommandClicked = () => {
        if (command === '') {
            enqueueSnackbar('No command', { variant: 'error' });
        } else {
            // setCommandHistory((history) => [...history, command]);
            // setCommandHistoryIndex(-1);
            // setTypedStuff('');
            commandHistory.push(command);
            commandHistoryIndex = -1;
            typedStuff = '';

            // callCommand(command).then(
            //     (data: any) => {
            //         console.log(data);
            //         setCommand('');
            //         if (data.status) {
            //             setCommandResponses((old) => [...old, data.response]);
            //         } else {
            //             enqueueSnackbar(data.error, { variant: 'error' });
            //         }
            //     },
            //     (e) => {
            //         enqueueSnackbar(JSON.stringify(e), { variant: 'error' });
            //     }
            // );
        }
    };

    const deleteLastLine = () => {
        const lines = command.split('\n');
        const first = lines.shift();

        lines.pop();

        const remaining = [first, ...lines].join('\n');
        setCommand(remaining);
    };

    const increaseHistoryIndex = () => {
        // if the go up from -1 to 0, store the text user entered at -1 position
        if (commandHistoryIndex === -1) {
            // setTypedStuff(command);
            typedStuff = command;
        }

        const newIndex = commandHistoryIndex + 1;
        const highestIndex = commandHistory.length - 1;
        if (newIndex <= highestIndex) {
            // setCommandHistoryIndex(newIndex);
            commandHistoryIndex = newIndex;
        }

        // TODO: we set index state and read it in same render cycle,
        const myCommand = getCommand();
        setCommand(myCommand);
    };

    const decreaseHistoryIndex = () => {
        const newIndex = commandHistoryIndex - 1;
        if (newIndex >= -1) {
            // setCommandHistoryIndex(newIndex);
            commandHistoryIndex = newIndex;
        }

        // TODO: we set index state and read it in same render cycle,
        const myCommand = getCommand();
        setCommand(myCommand);
    };

    const getCommand = () => {
        if (commandHistoryIndex === -1) {
            return typedStuff;
        } else {
            return commandHistory[commandHistory.length - 1 - commandHistoryIndex];
        }
    };

    const handleKeyDown = (event: any) => {
        // enter
        if (event.which === 13 && !event.shiftKey) {
            event.preventDefault();
            onCallMinimaCommandClicked();
        }

        // up arrow
        else if (event.which === 38 && !event.shiftKey) {
            event.preventDefault();
            increaseHistoryIndex();
        }

        // down arrow
        else if (event.which === 40 && !event.shiftKey) {
            event.preventDefault();
            decreaseHistoryIndex();
        }
    };

    /// 5000 characters (tximport, txexport), multiline input
    // proxy
    // electron
    // arrow key for previous commands
    // Add asci minima

    const prettify = (myObj: any) => {
        let str = JSON.stringify(myObj, null, 2);
        str = str.replace(/\\n/g, '\n');
        return str;
    };

    return (
        <>
            <h1>Terminal</h1>
            {commandResponses.map((res, i) => (
                <Paper sx={{ p: 2, mb: 2, overflow: 'auto' }} key={i}>
                    <pre>{prettify(res)}</pre>
                </Paper>
            ))}

            <form onSubmit={onCallMinimaCommandClicked} id="command-form">
                <TextareaAutosize
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onSubmit={onCallMinimaCommandClicked}
                    onKeyDown={handleKeyDown}
                    id="minima-command"
                    form="command-form"
                    minRows={6}
                    style={{ width: '100%', marginBottom: 16 }}
                />
                <Button variant="contained" onClick={onCallMinimaCommandClicked} ref={buttonRef}>
                    Send command
                </Button>

                {/* <Button onClick={() => console.log(commandHistory)}>Get Command History</Button> */}
            </form>

            {/* Added as a spacer (wrong i know!) */}
            <h1></h1>
        </>
    );
};

export default Terminal;
