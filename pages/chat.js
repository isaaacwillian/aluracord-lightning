import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React, { useState } from "react";
import appConfig from "../config.json";

export default function ChatPage() {
  const [mensagem, setMensagem] = useState("");
  const [listMessages, setListMessages] = useState([]);

  function handleNewMessage(newMessage) {
    const message = {
      id: listMessages.length + 1,
      from: "isaaacwillian",
      text: newMessage,
    };
    setListMessages([message, ...listMessages]);
    setMensagem("");
  }

  function removeMessage(id) {
    let newListMessages = listMessages.filter((message) => {
      if (message.id !== id) {
        return message;
      }
    });
    setListMessages(newListMessages);
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      ></link>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage: `url(https://images.unsplash.com/photo-1511149755252-35875b273fd6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            borderRadius: "5px",
            backgroundColor: "hsla(230, 90%, 10%, 0.700)",
            height: "100%",
            maxWidth: "95%",
            maxHeight: "95vh",
            padding: "32px",
          }}
        >
          <Header />
          <Box
            styleSheet={{
              position: "relative",
              display: "flex",
              flex: 1,
              height: "80%",
              backgroundColor: "hsla(230, 90%, 70%, 0.100)",
              flexDirection: "column",
              borderRadius: "5px",
              padding: "16px",
            }}
          >
            <MessageList
              messages={listMessages}
              removeMessage={removeMessage}
            />

            <Box
              as="form"
              styleSheet={{
                display: "flex",
              }}
            >
              <TextField
                value={mensagem}
                onChange={(event) => {
                  setMensagem(event.target.value);
                }}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleNewMessage(mensagem);
                  }
                }}
                placeholder="Insira sua mensagem aqui..."
                type="textarea"
                styleSheet={{
                  width: "100%",
                  border: "0",
                  resize: "none",
                  borderRadius: "5px",
                  padding: "6px 8px",
                  paddingRight: "45px",
                  backgroundColor: "hsla(230, 90%, 10%, 0.900)",
                  color: appConfig.theme.colors.neutrals["000"],
                }}
              />
              <Button
                onClick={() => {
                  handleNewMessage(mensagem);
                }}
                colorVariant="neutral"
                label={<span class="material-icons">send</span>}
                styleSheet={{
                  background: "none",
                  position: "absolute",
                  right: "15px",
                  hover: {
                    backgroundColor: appConfig.theme.colors.primary[400],
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          variant="heading5"
          styleSheet={{
            color: "white",
          }}
        >
          Chat
        </Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
          styleSheet={{
            color: appConfig.theme.colors.neutrals["200"],
            hover: {
              backgroundColor: appConfig.theme.colors.primary[700],
            },
          }}
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
        overflow: "hidden",
      }}
    >
      {props.messages.map((message) => {
        return (
          <Text
            key={message.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              backgroundColor: "hsla(230, 90%, 10%, 0.500)",
              hover: {
                backgroundColor: appConfig.theme.colors.primary[800],
              },
              active: {
                backgroundColor: appConfig.theme.colors.primary[800],
              },
              wordBreak: "break-all",
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
                position: "relative",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/isaaacwillian.png`}
              />
              <Text tag="strong">{message.from}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
              <Button
                onClick={() => {
                  props.removeMessage(message.id);
                }}
                colorVariant="neutral"
                label={<span class="material-icons">clear</span>}
                styleSheet={{
                  background: "none",
                  position: "absolute",
                  right: "-7px",
                  hover: {
                    backgroundColor: appConfig.theme.colors.primary[400],
                  },
                  top: "-10px",
                }}
              />
            </Box>
            {message.text}
          </Text>
        );
      })}
    </Box>
  );
}
