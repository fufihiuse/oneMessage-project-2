const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect, useContext, createContext } = React;
const { createRoot } = require('react-dom/client');

let root;
let previousPage;
let hasPremiumSubscription = false;

const PremiumContext = createContext(false);

const handleMessage = (e, onMessageSent, isPremium) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#messageName').value;
    const message = e.target.querySelector('#messageBody').value;

    if (!name || !message) {
        helper.handleError('All fields are required!');
        return false;
    }
    helper.sendPost(e.target.action, { name, message, isPremium }, onMessageSent,);
    return false;
};

const MessageForm = (props) => {
    const [isPremium] = useContext(PremiumContext);
    return (
        <form onSubmit={(e) => handleMessage(e, props.triggerReload, isPremium)}
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
    const [isPremium, setIsPremium] = useContext(PremiumContext);

    useEffect(() => {
        const loadCurrentMessage = async () => {
            let response;
            if (isPremium) {
                response = await fetch('/getPremiumMessage');
            }
            else {
                response = await fetch('/getMessage');
            }
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
            <h1>The current {isPremium && <span id="premiumText">premium </span>}oneMessage is from <span id="name">{currentMessage.name}</span>:</h1>
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
    fetch('/logout');
    return false;
}

// Toggleable premium button for subscribers
const PremiumCrown = (props) => {
    const [isPremiumSub, setPremiumSub] = useState(props.isPremiumSub);
    const [isPremium, setIsPremium] = useContext(PremiumContext);

    useEffect(() => {
        const checkSubscription = async () => {
            const response = await fetch('/getPremiumStatus');
            const data = await response.json()
            setPremiumSub(data);
        };
        checkSubscription();

    });

    if (!isPremiumSub) {
        return;
    }

    let imgName = isPremium ? 'crown-premium.png' : 'crown-normal.png';
    let imgPath = '/assets/img/' + imgName;
    return (
        <img src={imgPath} alt='premium toggle crown' id='premiumCrown' onClick={() => { setIsPremium(!isPremium) }}></img>
    )
}

const App = () => {
    const [reloadMessage, setReloadMessage] = useState(false);
    const [isPremiumSub, setPremiumSub] = useState(hasPremiumSubscription);
    const [isPremium, setIsPremium] = useState(false); // Tracks is user is using premium features

    return (
        <PremiumContext.Provider value={[isPremium, setIsPremium]}>
            <PremiumCrown isPremiumSub={isPremiumSub} isPremium={isPremium} />
            <div id="currentMessage">
                <Message currentMessage={[]} reloadMessage={reloadMessage} />
            </div>
            <div id="submitMessage">
                Submit your oneMessage:
                <MessageForm triggerReload={() => setReloadMessage(!reloadMessage)} />
            </div>
        </PremiumContext.Provider>
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
    previousPage = <Settings />
    root.render(
        <div className="settingsPanel">
            <ChangePasswordForm />
            <BackButton />
        </div>
    );
}

const goBack = () => {
    root.render(previousPage);
}

const BackButton = () => {
    return <button id='backButton' onClick={goBack}>Back</button>;
}

const buyPremium = () => {
    helper.hideError();
    helper.sendPost('/buyPremium', {});

    fetch('/');
    return false;
}

const BuyPremiumButton = () => {
    if (!hasPremiumSubscription) {
        return <button onClick={buyPremium}>Purchase Premium</button>
    }
    else {
        return;
    }
}

const Settings = () => {
    previousPage = <App />;
    return (
        <div className="settingsPanel">
            <button onClick={showChangePassword}>Change Password</button>
            <BuyPremiumButton />
            <BackButton />
        </div>
    );
}

const init = () => {
    const settingsButton = document.getElementById('settingsButton');

    root = createRoot(document.getElementById('app'));

    settingsButton.addEventListener('click', (e) => {
        e.preventDefault();
        previousPage = <App />;
        root.render(<Settings />);
        return false;
    })
    previousPage = <App />;
    root.render(<App />);
};

window.onload = init;