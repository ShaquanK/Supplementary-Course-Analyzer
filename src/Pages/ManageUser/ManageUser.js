import React, { useState } from "react";
import DefaultLayout from "../../components/default/layout";
import {
  Grid,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Card,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  updateEmail,
  sendEmailVerification,
} from "firebase/auth";

function ManageUser() {
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [currentEmail, setCurrentEmail] = useState(""); // New state for current email
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success', 'error', 'info', etc.

  const auth = getAuth();

  const handleReauthenticate = async (currentEmail, oldPassword) => {
    const credential = EmailAuthProvider.credential(currentEmail, oldPassword);
    try {
      await reauthenticateWithCredential(auth.currentUser, credential);
      return true;
    } catch (error) {
      console.error("Reauthentication failed:", error);
      setSnackbarMessage("Reauthentication failed. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return false;
    }
  };

  const handleUpdatePassword = async () => {
    const reauthenticated = await handleReauthenticate(
      currentEmail,
      oldPassword
    );
    if (reauthenticated) {
      updatePassword(auth.currentUser, newPassword)
        .then(() => {
          setSnackbarMessage("Password updated successfully");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          setOpenPasswordDialog(false);
        })
        .catch((error) => {
          console.error("Failed to update password:", error);
          setSnackbarMessage("Failed to update password. Please try again.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        });
    }
  };

  const handleUpdateEmail = async () => {
    const reauthenticated = await handleReauthenticate(
      currentEmail,
      oldPassword
    );

    if (reauthenticated) {
      try {
        // Send the email verification link to the new email
        const actionCodeSettings = {
          url: "https://pal-analyzer.firebaseapp.com/__/auth/action", // URL the user will land on after email verification
          handleCodeInApp: true, // Ensures the link opens in your app
        };

        // Update email after successful reauthentication
        await updateEmail(auth.currentUser, newEmail);

        // Send the verification email
        await sendEmailVerification(auth.currentUser);

        // Save the new email locally for later use
        window.localStorage.setItem("newEmailForSignIn", newEmail);

        setSnackbarMessage(
          "A verification email has been sent to the new address. Please confirm to finalize the email change."
        );
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
        setOpenEmailDialog(false);
      } catch (error) {
        console.error("Failed to send verification email:", error);
        setSnackbarMessage(
          `Failed to send verification email: ${error.message}`
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  return (
    <DefaultLayout title=" Manage User Information">
      <Grid container sx={{ flexDirection: { xs: "column", md: "row" } }}>
        <Grid
          item
          md={6}
          sx={{
            bgcolor: (theme) => theme.palette.primary.main,
            minHeight: "750px",
            p: 3,
            borderRadius: "10px",
          }}
        >
          <Stack spacing={3}>
            <Typography
              id="manage_password"
              variant="body1"
              sx={{
                color: "white",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => setOpenPasswordDialog(true)}
            >
              Manage Password
            </Typography>
            <Typography
              id="manage_email"
              variant="body1"
              sx={{
                color: "white",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => setOpenEmailDialog(true)}
            >
              Manage Email
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
      >
        <DialogTitle>Update Password</DialogTitle>
        <DialogContent>
          {/* Current Email */}
          <TextField
            id="current_email"
            label="Current Email"
            type="email"
            fullWidth
            margin="dense"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
          />
          {/* Old Password */}
          <TextField
            id="old_password"
            label="Old Password"
            type={showOldPassword ? "text" : "password"}
            fullWidth
            margin="dense"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {/* New Password */}
          <TextField
            id="new_password"
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            fullWidth
            margin="dense"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button id="update_password" onClick={handleUpdatePassword}>Update Password</Button>
        </DialogActions>
      </Dialog>

      {/* Email Update Dialog */}
      <Dialog open={openEmailDialog} onClose={() => setOpenEmailDialog(false)}>
        <DialogTitle>Update Email</DialogTitle>
        <DialogContent>
          <TextField
            id="current_email"
            label="Current Email"
            type="email"
            fullWidth
            margin="dense"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)} // New input field for current email
          />
          <TextField
            id="old_password"
            label="Old Password"
            type="password"
            fullWidth
            margin="dense"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            id="new_email"
            label="New Email"
            type="email"
            fullWidth
            margin="dense"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmailDialog(false)}>Cancel</Button>
          <Button id="update_email" onClick={handleUpdateEmail}>Update Email</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DefaultLayout>
  );
}

export default ManageUser;
