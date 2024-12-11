const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

let root;
let previousPage;
let currentPage;

const handleMessage = (e, onMessageSent) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#messageName').value;
    const message = e.target.querySelector('#messageBody').value;

    if (!name || !message) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { name, message }, onMessageSent);
    return false;
};

const MessageForm = (props) => {
    return (
        <form onSubmit={(e) => handleMessage(e, props.triggerReload)}
            name="messageForm"
            action="/message"
            method="POST"
            autoComplete="off"
        >
            <label htmlFor="message">Message:</label>
            <input type="text" id="messageBody" name="message" />
            <label htmlFor="name">Name:</label>
            <input type="text" id="messageName" name="name" />
            <input type="submit" value="submit" />
        </form>
    )
};

const Message = (props) => {
    const [currentMessage, setCurrentMessage] = useState(props.currentMessage);

    useEffect(() => {
        const loadCurrentMessage = async () => {
            const response = await fetch('/getMessage');
            const data = await response.json()
            setCurrentMessage(data.message);
        };
        loadCurrentMessage();

    });

    if (!currentMessage || currentMessage.length === 0) {
        return (
            <div id='message'>
                <h1>Error retrieving data from server!</h1>
            </div>
        );
    }

    return (
        <div>
            <h1>The current oneMessage is from <span id="name">{currentMessage.name}</span>:</h1>
            <div id="message">{currentMessage.message}</div>
        </div>
    )

}

const handlePassChange = (e) => {
    e.preventDefault();
    helper.hideError();

    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }
    helper.sendPost(e.target.action, { pass, pass2 });

    return false;
}

const App = () => {
    const [reloadMessage, setreloadMessage] = useState(false);

    return (
        <div>
            <div id="currentMessage">
                <Message currentMessage={[]} reloadMessage={reloadMessage} />
            </div>
            <div id="submitMessage">
                Submit your oneMessage:
                <MessageForm triggerReload={() => setreloadMessage(!reloadMessage)} />
            </div>
        </div>
    );
};

const ChangePasswordForm = () => {
    return (
        <form id="changePassForm"
            name="changePassForm"
            onSubmit={handlePassChange}
            action="/changePassword"
            method="POST"
            className='mainForm'>
            <label htmlFor="pass">New Password:</label>
            <input id="pass" type="password" name="pass" placeholder="new password" />
            <br />
            <label htmlFor="pass2">New Password:</label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <br />
            <input className="formSubmit" type="submit" value="Change" />
        </form>
    );
}

const showChangePassword = () => {
    previousPage = currentPage;
    currentPage = (
        <div className="settingsPanel">
            <ChangePasswordForm />
        </div>
    );

    root.render(currentPage);
}

const goBack = () => {

}

const BackButton = () => {
    return <button id='backButton' onClick={goBack}>Back</button>;
}

const Settings = () => {

    return (
        <div id="settings">
            <button onClick={showChangePassword}>Change Password</button>
        </div>
    );
}

const init = () => {
    const settingsButton = document.getElementById('settingsButton');

    root = createRoot(document.getElementById('app'));

    settingsButton.addEventListener('click', (e) => {
        e.preventDefault();
        previousPage = <App />;
        root.render(
            <div className='settingsPanel'>
                <Settings />
                <button onClick={goBack} id='backButton'>Back</button>
            </div>
        );
        return false;
    })
    previousPage = <App />;
    root.render(<App />);
};

window.onload = init;