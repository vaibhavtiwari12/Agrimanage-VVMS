import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FormattedMessage } from "react-intl";

const  NewModal = (props) =>  {
  
    const [modal, setModal] = useState(false);
    useEffect(() => {
      setModal(true)
    }, []);

    const toggle = () => {
      props.toggle()
      setModal(!modal);
    }
    const agree =() => {
        props.agree();
        setModal(!modal);
    }
  
      return (
        <div>
          
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>{props.heading}</ModalHeader>
            <ModalBody>
              {props.children}
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={agree}><FormattedMessage id="yesButton" /></Button>{' '}
              <Button color="danger" onClick={toggle}><FormattedMessage id="noButton" /></Button>{' '}
            </ModalFooter>
          </Modal>
        </div>
      );
  }


export default NewModal;