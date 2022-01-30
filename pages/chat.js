import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import appConfig from "../config.json";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function listenMessagesInRealTime(addMessage) {
  return supabase
    .from("mensagens")
    .on("INSERT", (res) => {
      addMessage(res.new);
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
    listenMessagesInRealTime((newMessage) => {
      setListMessages((currentListMessages) => {
        return [newMessage, ...currentListMessages];
      });
    });
  }, []);

  function handleNewMessage(newMessage) {
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

function MessageList(props) {
  const [name, setName] = useState("Isaac Willian");
  const [repo, setRepo] = useState(0);
  const [seg, setSeg] = useState(0);
  function fetchData(username, idClass) {
    fetch(`https://api.github.com/users/${username}`)
      .then((res) => res.json())
      .then((json) => {
        setName(json.name);
        setRepo(`Repositórios: ${json.public_repos}`);
        setSeg(`Seguidores: ${json.followers}`);
        document.getElementById(idClass).classList.remove("loadingBox");
      });
    console.log("working");
  }
  function resetData(idClass) {
    setName("");
    setRepo("");
    setSeg("");
    document.getElementById(idClass).classList.add("loadingBox");
  }
  return (
    <Box
      id="scrollChat"
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
        overflowX: "hidden",
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
                onMouseOver={() => {
                  document.getElementById(`${message.id}box`).style.display =
                    "block";
                  fetchData(message.de, `${message.id}box`);
                }}
                onMouseOut={() => {
                  document.getElementById(`${message.id}box`).style.display =
                    "none";
                  resetData(`${message.id}box`);
                }}
                src={`https://github.com/${message.de}.png`}
              />
              {/* esse é o box =================== */}
              <Box
                id={`${message.id}box`}
                className="loadingBox"
                styleSheet={{
                  minWidth: "200px",
                  top: "-8px",
                  left: "20px",
                  position: "absolute",
                  display: "none",
                  backgroundColor: "hsl(200, 20%, 20%)",
                  borderRadius: "25px",
                  padding: "5px",
                }}
              >
                <Image
                  src={`https://github.com/${message.de}.png`}
                  styleSheet={{
                    width: "50px",
                    borderRadius: "50%",
                    float: "left",
                    margin: "5px",
                  }}
                />
                <Text>
                  {`${name}`}
                  <br />
                </Text>
                <Text styleSheet={{ fontSize: "12px" }}>
                  {repo}
                  <br />
                  {seg}
                </Text>
              </Box>
              {/* até aqui ====================== */}
              <Text tag="strong">{message.de}</Text>
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
                label={<span className="material-icons">clear</span>}
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
            {message.texto.startsWith(":sticker:") ? (
              <Image
                src={message.texto.replace(":sticker:", "")}
                styleSheet={{ maxWidth: "120px" }}
              />
            ) : (
              message.texto
            )}
          </Text>
        );
      })}
    </Box>
  );
}
