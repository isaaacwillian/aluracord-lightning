import appConfig from "../config.json";
import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import { useState } from "react";
import { useRouter } from "next/router";
import useDebounce from "../hooks/useDebounce";

function Title(props) {
  const Tag = props.tag || "h1";
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.neutrals["000"]};
          font-size: 2, 5rem;
        }
      `}</style>
    </>
  );
}
export default function PaginaInicial() {
  const [username, setUsername] = useState("");
  const [bioUser, setBioUser] = useState("");
  const [nameUser, setNameUser] = useState("");
  const router = useRouter();
  const [validUser, setValidUser] = useState(false);
  const [pic, setPic] = useState(
    "https://cdn.pixabay.com/photo/2015/10/31/12/00/question-1015308_960_720.jpg"
  );
  const debouncedChange = useDebounce(fetchData, 500);

  function fetchData(username) {
    if (username.length > 2) {
      fetch(`https://api.github.com/users/${username}`)
        .then((res) => res.json())
        .then((json) => {
          if (Object.keys(json).length < 4) {
            setBioUser("Usuário Inválido");
          } else {
            setBioUser(json.bio);
            setNameUser(json.name);
            setPic(`https://github.com/${username}.png`);
            document.getElementById("photoArea").classList.remove("invalid");
            document.getElementById("textField").classList.remove("invalid");
            setValidUser(true);
          }
        });
    }
  }

  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1511149755252-35875b273fd6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            maxWidth: "700px",
            borderRadius: "5px",
            padding: "32px",
            margin: "16px",
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            backgroundColor: "hsla(230, 90%, 10%, 0.900)",
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={(event) => {
              event.preventDefault();
              if (validUser) {
                router.push(`/chat?username=${username}`);
              } else {
                document.getElementById("photoArea").classList.add("invalid");
                document.getElementById("textField").classList.add("invalid");
              }
            }}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <Title tag="h2">Entre com seu user GitHub!</Title>
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "32px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            >
              {appConfig.name}
            </Text>

            <TextField
              id="textField"
              onChange={(event) => {
                setUsername(event.target.value);
                setPic(
                  "https://cdn.pixabay.com/photo/2015/10/31/12/00/question-1015308_960_720.jpg"
                );
                setNameUser("");
                setBioUser("");
                setValidUser(false);
                debouncedChange(event.target.value);
              }}
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.primary[900],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.primary[100],
                },
              }}
            />
            <Button
              type="submit"
              label="Entrar"
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[700],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
              styleSheet={{
                boxShadow: `0px 0px 30px 0px ${appConfig.theme.colors.primary[700]}`,
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            id="photoArea"
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "200px",
              padding: "16px",
              backgroundColor: appConfig.theme.colors.primary[800],
              border: "1px solid",
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: "10px",
              flex: 1,
              minHeight: "240px",
              boxShadow: "2px 2px 5px hsla(0, 0%, 0%, 0.765)",
            }}
          >
            <Image
              styleSheet={{
                borderRadius: "50%",
                marginBottom: "16px",
              }}
              src={pic}
            />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals["000"],
                backgroundColor: appConfig.theme.colors.primary[600],
                padding: "3px 10px",
                borderRadius: "1000px",
                fontSize: "14px",
              }}
            >
              {nameUser}
            </Text>
            <p>
              {bioUser}
              <style jsx>{`
                p {
                  color: white;
                  font-size: 10px;
                  text-align: center;
                  margin-top: 8px;
                }
              `}</style>
            </p>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}
