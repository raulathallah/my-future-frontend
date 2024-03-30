"use client";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  Spacer,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createAction, deleteAction, getAllAction } from "./axios/action";
import { useRouter } from "next/navigation";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

export default function Home() {
  const router = useRouter();
  const [myList, setMyList] = useState<Action[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState(0);
  const [tryAPI, setTryAPI] = useState(false);

  useEffect(() => {
    getAllAction()
      .then((res) => setMyList(res.data))
      .catch((err) => console.log(err.message));
  }, [myList]);
  useEffect(() => {
    setTimeout(() => {
      if (status === 200) {
        window.location.reload();
      } else {
        setStatus(0);
      }
    }, 5000);
    setTryAPI(false);
  }, [tryAPI]);

  const onAddAction = () => {
    if (title && description) {
      const body: ActionBody = {
        title,
        description,
      };
      createAction(body)
        .then((res) => setStatus(res.status))
        .catch((err) => err.response && setStatus(err.response.status));
    } else {
      setStatus(300);
      setTimeout(() => {
        setStatus(0);
      }, 5000);
    }
    setTryAPI(true);
  };

  const onDeleteAction = (id: string) => {
    deleteAction(id)
      .then((res) => setStatus(res.status))
      .catch((err) => err.response && setStatus(err.response.status));
    setTryAPI(true);
  };

  return (
    <div className="grid gap-6">
      {status > 200 && (
        <Alert status="error" className="p-6">
          <AlertIcon />
          Action Failed!
        </Alert>
      )}
      {status === 200 && (
        <Alert status="success" className="p-6">
          <AlertIcon />
          Action Success!
        </Alert>
      )}
      <Grid templateColumns="repeat(2, 1fr)" gap={6} w={"100%"}>
        <GridItem>
          <Box
            borderWidth={"2px"}
            borderRadius={"20px"}
            className="flex flex-col gap-4 p-6"
          >
            <Heading>My List</Heading>
            {myList.map((val) => (
              <Card variant={"outline"} className="text-left" key={val._id}>
                <CardBody className="grid grid-cols-2 gap-2">
                  <div className="">
                    <Heading size={"sm"} fontWeight={"bold"}>
                      {val.title}
                    </Heading>
                    <Text>{val.description}</Text>
                  </div>
                  <div className="text-right flex justify-end gap-2">
                    <IconButton
                      isRound
                      variant="outline"
                      colorScheme="teal"
                      aria-label="Delete"
                      icon={<EditIcon style={{ fontSize: 20 }} />}
                    />
                    <IconButton
                      isRound
                      variant="outline"
                      colorScheme="teal"
                      aria-label="Delete"
                      icon={<DeleteIcon style={{ fontSize: 20 }} />}
                      onClick={() => onDeleteAction(val._id)}
                    />
                  </div>
                </CardBody>
              </Card>
            ))}
          </Box>
        </GridItem>
        <GridItem>
          <Box
            maxW={"sm"}
            borderWidth={"2px"}
            borderRadius={"20px"}
            className="flex flex-col gap-4 p-6"
          >
            <Heading>Add To-Do</Heading>
            <Stack spacing={2}>
              <Input
                placeholder="Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Description..."
                resize={"none"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Spacer />
              <Button
                colorScheme="teal"
                variant="solid"
                className=""
                onClick={onAddAction}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </GridItem>
      </Grid>
    </div>
  );
}
