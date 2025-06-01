import React, { Component } from "react";
import "../../assets/Conversation.css";
import MessageBubble from "./MessageBubble";
import Dropzone from "react-dropzone";
import styles from "../../assets/Conversation.module.css";
import { Form, Input } from "antd";
import { Button } from "@mui/material";
import Icon from "@ant-design/icons";
import ConversationsMessages from "./ConversationsMessages";
import PropTypes from "prop-types";

class Conversation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage: "",
      conversationProxy: props.conversationProxy,
      messages: [],
      loadingState: "initializing",
      boundConversations: new Set(),
    };
  }

  loadMessagesFor = (thisConversation) => {
    if (this.state.conversationProxy === thisConversation) {
      thisConversation
        .getMessages()
        .then((messagePaginator) => {
          if (this.state.conversationProxy === thisConversation) {
            this.setState({
              messages: messagePaginator.items,
              loadingState: "ready",
            });
          }
        })
        .catch((err) => {
          console.error("Couldn't fetch messages IMPLEMENT RETRY", err);
          this.setState({ loadingState: "failed" });
        });
    }
  };

  componentDidMount = () => {
    if (this.state.conversationProxy) {
      this.loadMessagesFor(this.state.conversationProxy);

      if (!this.state.boundConversations.has(this.state.conversationProxy)) {
        let newConversation = this.state.conversationProxy;
        newConversation.on("messageAdded", (m) =>
          this.messageAdded(m, newConversation)
        );
        this.setState({
          boundConversations: new Set([
            ...this.state.boundConversations,
            newConversation,
          ]),
        });
      }
    }
  };

  componentDidUpdate = (oldProps, oldState) => {
    if (this.state.conversationProxy !== oldState.conversationProxy) {
      this.loadMessagesFor(this.state.conversationProxy);

      if (!this.state.boundConversations.has(this.state.conversationProxy)) {
        let newConversation = this.state.conversationProxy;
        newConversation.on("messageAdded", (m) =>
          this.messageAdded(m, newConversation)
        );
        this.setState({
          boundConversations: new Set([
            ...this.state.boundConversations,
            newConversation,
          ]),
        });
      }
    }
  };

  static getDerivedStateFromProps(newProps, oldState) {
    let logic =
      oldState.loadingState === "initializing" ||
      oldState.conversationProxy !== newProps.conversationProxy;
    if (logic) {
      return {
        loadingState: "loading messages",
        conversationProxy: newProps.conversationProxy,
      };
    } else {
      return null;
    }
  }

  messageAdded = (message, targetConversation) => {
    if (targetConversation === this.state.conversationProxy)
      this.setState((prevState, props) => ({
        messages: [...prevState.messages, message],
      }));
  };

  onMessageChanged = (event) => {
    this.setState({ newMessage: event.target.value });
  };

  sendMessage = (event) => {
    event.preventDefault();
    const message = this.state.newMessage;
    this.setState({ newMessage: "" });
    this.state.conversationProxy.sendMessage(message);
  };

  onDrop = (acceptedFiles) => {
    this.state.conversationProxy.sendMessage({
      contentType: acceptedFiles[0].type,
      media: acceptedFiles[0],
    });
  };

  render = () => {
    return (
      <Dropzone
        onDrop={this.onDrop}
        accept={{ mimeType: ["image/jpeg", "image/png", "image/gif"] }}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            onClick={() => {}}
            id="OpenChannel"
            style={{ position: "relative", top: 0 }}
          >
            {isDragActive && (
              <div className={styles.drop}>
                <Icon
                  type={"cloud-upload"}
                  style={{ fontSize: "5em", color: "#fefefe" }}
                />
                <h3 style={{ color: "#fefefe" }}>Release to Upload</h3>
              </div>
            )}
            <div
              className={styles.messages}
              style={{
                minHeight: "65vh",
                maxHeight: "65vh",
                filter: `blur(${isDragActive ? 4 : 0}px)`,
              }}
            >
              <input id="files" {...getInputProps()} />
              <div
                style={{
                  flexBasis: "100%",
                  flexGrow: 2,
                  flexShrink: 1,
                  border: "1px solid #d9d9d9",
                  borderBottom: 0,
                  overflowY: "auto",
                  margin: "1px 0 0 -1px",
                }}
              >
                <ConversationsMessages
                  identity={this.props.myIdentity}
                  messages={this.state.messages}
                />
              </div>
              <div>
                <Form onSubmitCapture={this.sendMessage}>
                  <Input.Group
                    compact={true}
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Input
                      style={{ flexBasis: "100%" }}
                      placeholder={"Type your message here..."}
                      type={"text"}
                      name={"message"}
                      id={styles["type-a-message"]}
                      autoComplete={"off"}
                      disabled={this.state.loadingState !== "ready"}
                      onChange={this.onMessageChanged}
                      value={this.state.newMessage}
                    />
                    <Button
                      id="send-button"
                      icon="enter"
                      htmltype="submit"
                      type={"submit"}
                    >
                      {" "}
                      Send{" "}
                    </Button>
                  </Input.Group>
                </Form>
              </div>
            </div>
          </div>
        )}
      </Dropzone>
    );
  };
}

Conversation.propTypes = {
  myIdentity: PropTypes.string.isRequired,
};

export default Conversation;
