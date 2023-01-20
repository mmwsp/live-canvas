import React, { useEffect, useRef, useState } from "react";
import canvasState from "../store/canvasState";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const ModalWindow = () => {

    const usernameRef = useRef()

    const connectHandler = () => {
        canvasState.setUsername(usernameRef.current.value)
        canvasState.isModal = false
    }

    return (
        <Modal show={canvasState.isModal} onHide={() => {}}>
                <Modal.Header style={{justifyContent: 'center', backgroundColor: '#E0FFFF'}}>
                    <Modal.Title>Welcome</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Input your username:</Form.Label>
                                <Form.Control
                                    type="text"
                                    autoFocus
                                    ref={usernameRef}
                                />
                        </Form.Group>
                    </Form>
                    <p style={{fontSize: '13px'}}>With empty username you can't set connection with other session participants.</p>
                    <br></br>
                    <p><b>Share the link above with people you want to draw together.</b></p>
                </Modal.Body>
                <Modal.Footer style={{justifyContent: 'center', backgroundColor: '#E0FFFF'}}>
                        <Button variant="outline-secondary" style={{width: '40%'}} size="lg" onClick={() => connectHandler()}>
                            Enter
                        </Button>
                </Modal.Footer>
            </Modal>
    );
};

export default ModalWindow;