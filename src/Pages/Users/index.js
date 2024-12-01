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
  TablePagination,
  Box,
} from "@mui/material";
import DefaultLayout from "../../components/default/layout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";

const UserList = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditUser = (user) => {
    console.log("Editing user:", user);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await userAPI.deleteUser(userId).then((resp) => {
        enqueueSnackbar("User deleted successfully", {
          variant: "success",
        });
      });
      setUsers(users.filter((user) => user.uid !== userId));
    } catch (error) {
      enqueueSnackbar("Something went wrong when attempting to delete user", {
        variant: "error",
      });
      console.error("Error deleting user:", error);
    }
  };

  return (
    <DefaultLayout title="User List">
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
            {/* Table Header */}
            <TableHead>
              <TableRow
                style={{
                  backgroundColor: "#333333",
                }}
              >
                <TableCell
                  style={{
                    borderRight: "2px solid #E5E4E2",
                    color: "#fff",
                  }}
                >
                  Display Name
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "2px solid #E5E4E2",
                    color: "#fff",
                  }}
                >
                  Email
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "2px solid #E5E4E2",
                    color: "#fff",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow
                    id="users-table"
                    key={user.uid}
                    sx={{
                      "&:nth-of-type(even)": { backgroundColor: "#f9f9f9" },
                    }}
                  >
                    <TableCell
                      style={{
                        borderRight: "2px solid #E5E4E2",
                      }}
                    >
                      {user?.displayName ? (
                        user.displayName
                      ) : (
                        <Typography
                          variant="string"
                          sx={{ fontStyle: "italic" }}
                        >
                          Not Set
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell
                      style={{
                        borderRight: "2px solid #E5E4E2",
                      }}
                    >
                      {user.email}
                    </TableCell>
                    <TableCell
                      style={{
                        borderRight: "2px solid #E5E4E2",
                      }}
                    >
                      <IconButton
                        id="delete-user-button"
                        onClick={() => handleDeleteUser(user?.uid)}
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: (theme) => theme.palette.secondary.main,
                          color: "white",
                          padding: 0,
                          minWidth: 0,
                          "&:hover": {
                            bgcolor: (theme) => theme.palette.secondary.dark,
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}
          />
        </TableContainer>
      ) : (
        <Grid container justifyContent="center" alignItems="center">
          <Typography variant="h6">No Users Found</Typography>
        </Grid>
      )}
    </DefaultLayout>
  );
};

export default UserList;
