import { useEffect } from 'react';
import { Alert } from 'react-bootstrap';

function MyAlert(props) {

    useEffect(() => {
        if (props.message) {
            const timer = setTimeout(() => {
                props.setMessage("");
            }, 5000);

            return () => {
                clearTimeout(timer)
            }
        }
    }, [props.message])

    return (
        props.message ?
            <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>
            : false
    );
}

export { MyAlert };