import 'MainPage.css'

function MainPage() {
    return (       
        <div className="iris-app-container">
        
        <div className="iris-header">
            <div className="logo">Iris</div>
        </div>
        
        <div className="iris-content">
            <img className="hero-image" src="https://placehold.co/212x196" alt="AI placeholder graphic" />
            
            <div className="headline-container">
                <span className="headline">Meet Your New </span>
                <span className="headline-primary">AI<br/>Companion</span>
            </div>
            
            <div className="description-container">
                <p className="description">Start a conversation and discover a smarter way to get things done. Our friendly AI is here to assist you 24/7.</p>
            </div>
            
            <a href="#" className="button-container">
                <div className="button-text">Start Chatting Now</div>
            </a>
        </div>
    </div>
    );
}

export default MainPage;