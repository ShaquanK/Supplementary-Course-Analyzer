import React, { useEffect, useState } from "react";
import { userAPI } from "../../routes/users/users";
import {
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import DefaultLayout from "../../components/default/layout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await userAPI.getUsers();
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    console.log("Editing user:", user);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await userAPI.deleteUser(userId);
      setUsers(users.filter((user) => user.uid !== userId));
      console.log("User deleted:", userId);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <DefaultLayout>
      <Stack p={3} spacing={2}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h4">User List</Typography>
          {loading ? (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              style={{ height: "100px" }}
            >
              <CircularProgress />
            </Grid>
          ) : users.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Display Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Actions</TableCell>{" "}
                    {/* New column for actions */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.uid}>
                      <TableCell>{user.displayName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={handleEditUser}
                          sx={{
                            width: "40px",
                            height: "40px",
                            bgcolor: (theme) => theme.palette.primary.main,
                            color: "white",
                            padding: 0,
                            mr: 1,
                            minWidth: "0",
                            "&:hover": {
                              bgcolor: (theme) => theme.palette.primary.dark,
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            handleDeleteUser(user?.uid);
                          }}
                          sx={{
                            width: "40px",
                            height: "40px",
                            bgcolor: (theme) => theme.palette.secondary.main,
                            color: "white",
                            padding: 0,
                            minWidth: "0",
                            "&:hover": {
                              bgcolor: (theme) => theme.palette.primary.dark,
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>

                        {/* </Button> */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Grid container justifyContent="center" alignItems="center">
              <Typography variant="h6">No Users Found</Typography>
            </Grid>
          )}
        </Card>
      </Stack>
    </DefaultLayout>
  );
};

export default UserList;
