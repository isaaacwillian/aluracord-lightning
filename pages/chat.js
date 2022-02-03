import { Box, Text, TextField, Button } from "@skynexui/components";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import appConfig from "../config.json";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";
import MessageList from "../src/components/MessageList";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function listenMessagesInRealTime(addMessage, removeMessage) {
  return supabase
    .from("mensagens")
    .on("INSERT", (res) => {
      addMessage(res.new);
    })
    .on("DELETE", (res) => {
      removeMessage(res.old.id);
    })
    .subscribe();
}

export default function ChatPage() {
  const [listMessages, setListMessages] = useState([]);
  const router = useRouter();
  const { username } = router.query;
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    supabase
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setListMessages(data);
        document.getElementById("load").classList.remove("loading");
      });
    listenMessagesInRealTime(
      (newMessage) => {
        setListMessages((currentListMessages) => {
          return [newMessage, ...currentListMessages];
        });
      },
      (id) => {
        setListMessages((currentListMessages) => {
          let newListMessages = currentListMessages.filter((message) => {
            if (message.id !== id) {
              return message;
            }
          });
          return newListMessages;
        });
      }
    );
  }, []);

  function handleNewMessage(newMessage) {
    if (newMessage !== "") {
      const message = {
        de: username,
        texto: newMessage,
      };
      supabase
        .from("mensagens")
        .insert([message])
        .then(({ data }) => {});
      setMensagem("");
    }
  }

  function removeMessage(id) {
    supabase
      .from("mensagens")
      .delete()
      .match({ id })
      .then(() => {
        let newListMessages = listMessages.filter((message) => {
          if (message.id !== id) {
            return message;
          }
        });
        setListMessages(newListMessages);
      });
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
            maxWidth: "1100px",
            maxHeight: "95vh",
            padding: "32px",
          }}
        >
          <Header />
          <Box
            id="load"
            className="loading"
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
              username={username}
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
                label={<span className="material-icons">send</span>}
                styleSheet={{
                  background: "none",
                  position: "absolute",
                  right: "70px",
                  hover: {
                    backgroundColor: appConfig.theme.colors.primary[400],
                  },
                }}
              />
              <ButtonSendSticker
                onStickerClick={(sticker) => {
                  handleNewMessage(":sticker:" + sticker);
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
