import React, { useEffect, useState } from "react";

import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "../dashboard/components/AppNavbar";
import Header from "../dashboard/components/Header";
import MainGrid from "../dashboard/components/MainGrid";
import SideMenu from "../dashboard/components/SideMenu";
import AppTheme from "../shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "../dashboard/theme/customizations";

import { allUsers, createUser, deleteUser, updateUser } from "../api/user";
import { allRoles } from "../api/role";
import { getUserColumns } from "../datatable/userTable";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function UserManagementPage(props) {
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmationPassword: "",
    role_id: "",
  });

  const [roles, setRoles] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);

  const [rows, setRows] = useState([]);

  const [openModal, setOpenModal] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleGetAllUsers = async () => {
    try {
      const response = await allUsers();

      setRows(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllRoles = async () => {
    try {
      const response = await allRoles();

      setRoles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddUser = async () => {
    try {
      await createUser(form);

      handleGetAllUsers();

      setOpenModal(false);

      alert("User was successfully created");

      setForm({
        name: "",
        email: "",
        password: "",
        role_id: "",
      });
    } catch (error) {
      alert(error.response.data.message || "Error when add user");
    }
  };

  const handleEditUser = async () => {
    try {
      await updateUser(form);

      handleGetAllUsers();

      setOpenModal(false);

      alert("User was successfully updated");

      setForm({
        name: "",
        email: "",
        password: "",
        role_id: "",
      });
    } catch (error) {
      alert(error.response.data.message || "Error when edit user");
    }
  };

  const handleDeleteRole = async () => {
    try {
      await deleteUser({ id: selectedUser.id });

      handleGetAllUsers();

      alert("User was successfully deleted");

      setDeleteConfirmOpen(false);
      setSelectedUser(null);
    } catch (error) {
      alert(error.response.data.message || "Error when delete user");
    }
  };

  const onEdit = (row) => {
    setOpenModal(true);
    setSelectedUser(row);
    setForm(row);
  };

  const onDelete = (row) => {
    setSelectedUser(row);
    setDeleteConfirmOpen(true);
  };

  useEffect(() => {
    handleGetAllUsers();
    handleGetAllRoles();
  }, []);

  const columns = getUserColumns({
    onEdit: onEdit,
    onDelete: onDelete,
  });

  useEffect(() => {
    if (user.role.name !== "admin") {
      navigate("/dashboard");
    }
  }, [user]);

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header title="User Management" />

            <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
              <Typography
                component="h2"
                variant="h6"
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                User Data{" "}
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedUser(null);
                    setOpenModal(true);
                    setForm({
                      name: "",
                      email: "",
                      password: "",
                      role_id: "",
                    });
                  }}
                >
                  Add
                </Button>
              </Typography>
            </Box>

            <MainGrid columns={columns} rows={rows} />
          </Stack>

          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                width: 400,
              }}
            >
              <Typography variant="h6" gutterBottom>
                {selectedUser ? "Edit User" : "Add New User"}
              </Typography>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                sx={{ my: 2 }}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={form.email}
                type="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                sx={{ my: 2 }}
              />
              {!selectedUser && (
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  value={form.password}
                  type="password"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  sx={{ my: 2 }}
                />
              )}
              <FormControl fullWidth sx={{ my: 2 }}>
                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={form.role_id}
                  label="Age"
                  onChange={(e) =>
                    setForm({ ...form, role_id: e.target.value })
                  }
                >
                  {roles.map((role) => (
                    <MenuItem value={role.id} key={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                fullWidth
                onClick={selectedUser ? handleEditUser : handleAddUser}
              >
                Submit
              </Button>
            </Box>
          </Modal>

          <Modal
            open={deleteConfirmOpen}
            onClose={() => setDeleteConfirmOpen(false)}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                width: 400,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Confirm Deletion
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Are you sure you want to delete the role{" "}
                <strong>{selectedUser?.name}</strong>?
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => setDeleteConfirmOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteRole}
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          </Modal>
        </Box>
      </Box>
    </AppTheme>
  );
}
