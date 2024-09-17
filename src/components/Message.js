import '../index.css';

const Message = ({ role, content }) => {
    const className = `${role === 'user' ? 'user-message' : 'llama-message'}`;
    const name = `${role === 'user' ? 'You' : 'AI'}`;

    return (
        <div>
            <div className={className}>
                <div>{name}</div>
                <div className={className+"-bubble"}>
                    {content}
                </div>
            </div>
        </div>
    );
};

export default Message;