import React, { useState } from "react";
import DefaultLayout from "../../components/default/layout";
import { Grid, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { getAuth, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from "firebase/auth";

function ManageUser() {
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const auth = getAuth();

  const handleReauthenticate = async (oldPassword) => {
    const credential = EmailAuthProvider.credential(auth.currentUser.email, oldPassword);
    try {
      await reauthenticateWithCredential(auth.currentUser, credential);
      return true;
    } catch (error) {
      console.error("Reauthentication failed:", error);
      return false;
    }
  };

  const handleUpdatePassword = async () => {
    const reauthenticated = await handleReauthenticate(oldPassword);
    if (reauthenticated) {
      updatePassword(auth.currentUser, newPassword)
        .then(() => alert("Password updated successfully"))
        .catch((error) => console.error("Failed to update password:", error));
      setOpenPasswordDialog(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="App">
        <h1><span>Manage User Information</span></h1>
        <Grid container sx={{ flexDirection: { xs: "column", md: "row" } }}>
          <Grid item md={6} sx={{ bgcolor: (theme) => theme.palette.primary.main, minHeight: "750px", p: 3 }}>
            <Stack spacing={3}>
              <Typography variant="h3" sx={{ color: "white" }}>Manage Account</Typography>
              <Typography
                variant="body1"
                sx={{ color: "white", cursor: "pointer", textDecoration: "underline" }}
                onClick={() => setOpenPasswordDialog(true)}
              >
                Manage Password
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
          <DialogTitle>Update Password</DialogTitle>
          <DialogContent>
            <TextField
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
            <TextField
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
            <Button onClick={handleUpdatePassword}>Update Password</Button>
          </DialogActions>
        </Dialog>
      </div>
    </DefaultLayout>
  );
}

export default ManageUser;
