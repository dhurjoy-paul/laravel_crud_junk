interface ContactProps {
    greetings: string;
    name: string;
}

const Contact = ({ greetings, name }: ContactProps) => {
    return (
        <div>
            <h1>{greetings}</h1>
            <p>Welcome, {name}</p>
        </div>
    );
};

export default Contact;
