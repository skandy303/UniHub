import React from "react";
import { Badge, Layout, Typography } from "antd";
import { Client as ConversationsClient } from "@twilio/conversations";

import "../../assets/Conversation.css";
import "../../assets/ConversationSection.css";

import Conversation from "./Conversation";
import { ConversationsList } from "./ConversationsList";
import { HeaderItem } from "./HeaderItem";

import { createConversation } from "../../api/listings";

const { Content, Sider, Header } = Layout;
const { Text } = Typography;

class ConversationsApp extends React.Component {
  constructor(props) {
    document.title = "Messages | UniHub";
    super(props);
    const name = localStorage.getItem("name") || "";
    const loggedIn = name !== "";
    this.a = [];
    this.state = {
      listing: props.listing,
      customer: props.customer,
      name,
      loggedIn,
      token: null,
      statusString: "Not connected",
      conversationsReady: false,
      conversations: [],
      selectedConversationSid: null,
      newMessage: "",
    };
  }

  componentDidMount = () => {
    this.state.loggedIn = true;
    if (this.state.loggedIn) {
      this.getToken();
    }
  };

  getToken = async () => {
    try {
      const data = await createConversation(this.state.listing);
      if (data.Error) {
        this.setState({
          status: "error",
        });
        return;
      }
      this.setState({
        statusString: "Connected.",
        status: "success",
        loggedIn: true,
        name: data.Name,
      });
      let myToken = data.Customer;
      if (this.state.listing == "-1" && this.state.customer == "-1") {
        myToken = data.Lister;
      }
      this.setState({ token: myToken }, this.initConversations);
    } catch (error) {
      console.log(error);
      this.setState({
        statusString: "Not connected",
        status: "error",
      });
    }
  };

  initConversations = async () => {
    window.conversationsClient = await ConversationsClient;
    this.conversationsClient = await ConversationsClient.create(
      this.state.token
    );

    await this.conversationsClient.onWithReplay(
      "conversationJoined",
      async () => {
        this.setState({
          statusString: "You are connected.",
          status: "success",
        });
        await this.setState({
          conversations: await (
            await this.conversationsClient.getSubscribedConversations()
          ).items,
        });
      }
    );

    this.conversationsClient.on("conversationLeft", (thisConversation) => {
      this.setState({
        conversations: [
          ...this.state.conversations.filter((it) => it !== thisConversation),
        ],
      });
    });
  };

  render() {
    const { conversations, selectedConversationSid, status } = this.state;
    const selectedConversation = conversations.find(
      (it) => it.sid === selectedConversationSid
    );

    let conversationContent;
    if (selectedConversation) {
      conversationContent = (
        <Conversation
          conversationProxy={selectedConversation}
          myIdentity={this.state.name}
        />
      );
    } else if (status !== "success") {
      conversationContent = "Sorry, you have no existing conversations!";
    } else {
      conversationContent = "";
    }

    return (
      <div className="conversations-window-wrapper">
        <Layout className="conversations-window-container">
          <Header
            style={{
              left: "30vw",
              margin: "0 -2px 0 -2px",
              position: "absolute",
              height: "5em",
              width: "auto",
              zIndex: "2",
              border: "1px solid #d9d9d9",
              background: "white",
              display: "flex",
              alignItems: "center",
              padding: 0,
            }}
          >
            <div
              style={{
                maxWidth: "0px",
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            ></div>
            <div style={{ display: "flex", width: "50vw" }}>
              <HeaderItem style={{ padding: "0px 60px" }}>
                <Text
                  strong
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#666")}
                  onMouseLeave={(e) => (e.target.style.color = "#333")}
                  onClick={() => {
                    window.location.href =
                      "/listing/" +
                      selectedConversation.uniqueName.split("-").pop(); // replace this URL with your desired destination
                  }}
                >
                  {selectedConversation &&
                    (selectedConversation.friendlyName ||
                      selectedConversation.sid)}
                </Text>
              </HeaderItem>
              <HeaderItem
                style={{ right: "1.5em", top: 0, position: "absolute" }}
              >
                <Badge
                  dot={true}
                  status={this.state.status}
                  style={{ marginLeft: "1em" }}
                />
              </HeaderItem>
            </div>
          </Header>
          <Layout style={{ background: "white" }}>
            <Sider style={{ zIndex: "3" }} theme={"light"} width={"30vw"}>
              <ConversationsList
                conversations={conversations}
                selectedConversationSid={selectedConversationSid}
                onConversationClick={(item) => {
                  this.setState({ selectedConversationSid: item.sid });
                }}
              />
            </Sider>
            <Content className="conversation-section">
              <div id="SelectedConversation">{conversationContent}</div>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default ConversationsApp;
