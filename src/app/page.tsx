"use client";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";
import {
  createAction,
  deleteAction,
  editAction,
  getAllAction,
} from "./axios/action";
import { useRouter } from "next/navigation";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

export default function Home() {
  const router = useRouter();

  const {
    isOpen: isOpenAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const [myList, setMyList] = useState<Action[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actionTitle, setActionTitle] = useState("");
  const [actionId, setActionId] = useState("");
  const [actionDescription, setActionDescription] = useState("");

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
    reset();
  }, [tryAPI]);

  const reset = () => {
    onCloseAdd();
    onCloseDelete();
    onCloseEdit();
    setActionId("");
    setActionTitle("");
    setTitle("");
    setDescription("");
  };

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

  const onDelete = (title: string, id: string) => {
    setActionTitle(title);
    setActionId(id);
    onOpenDelete();
  };

  const onEdit = (title: string, id: string, desc: string) => {
    setActionTitle(title);
    setActionDescription(desc);
    setActionId(id);
    onOpenEdit();
  };

  const onDeleteAction = (id: string) => {
    deleteAction(id)
      .then((res) => setStatus(res.status))
      .catch((err) => err.response && setStatus(err.response.status));
    setTryAPI(true);
  };

  const onEditAction = (id: string, body: ActionBody) => {
    editAction(id, body)
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
      <Stack className="place-self-center">
        <Box
          borderWidth={"2px"}
          borderRadius={"20px"}
          className="flex flex-col gap-4 p-6"
          w={1200}
        >
          <div className="flex w-full justify-between">
            <Heading>My List</Heading>
            <Button onClick={onOpenAdd} colorScheme="teal">
              Add To-Do
            </Button>
          </div>
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
                    aria-label="Edit"
                    icon={<EditIcon style={{ fontSize: 20 }} />}
                    onClick={() => onEdit(val.title, val._id, val.description)}
                  />
                  <IconButton
                    isRound
                    variant="outline"
                    colorScheme="teal"
                    aria-label="Delete"
                    icon={<DeleteIcon style={{ fontSize: 20 }} />}
                    onClick={() => onDelete(val.title, val._id)}
                  />
                </div>
              </CardBody>
            </Card>
          ))}
        </Box>
      </Stack>

      <Modal isOpen={isOpenAdd} onClose={onCloseAdd}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add To-Do</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={onCloseAdd}
              variant={"ghost"}
            >
              Close
            </Button>
            <Button variant="solid" colorScheme="teal" onClick={onAddAction}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenDelete} onClose={onCloseDelete}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure want to delete this item?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{`Title: ${actionTitle}`}</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="solid"
              colorScheme="teal"
              onClick={() => onDeleteAction(actionId)}
              mr={3}
            >
              Yes
            </Button>
            <Button
              colorScheme="teal"
              onClick={onCloseDelete}
              variant={"ghost"}
            >
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenEdit} onClose={onCloseEdit}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit To-Do</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={2}>
              <Input
                placeholder="Title..."
                value={actionTitle}
                onChange={(e) => setActionTitle(e.target.value)}
              />
              <Textarea
                placeholder="Description..."
                resize={"none"}
                value={actionDescription}
                onChange={(e) => setActionDescription(e.target.value)}
              />
              <Spacer />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={onCloseEdit}
              variant={"ghost"}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              colorScheme="teal"
              onClick={() => {
                const body = {
                  title: actionTitle,
                  description: actionDescription,
                };
                onEditAction(actionId, body);
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
