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

import { allRoles, createRole, deleteRole, updateRole } from "../api/role";
import { getRoleColumns } from "../datatable/roleTable";
import { Button, Modal, TextField, Typography } from "@mui/material";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function RoleManagementPage(props) {
  const [roleId, setRoleId] = useState("");

  const [rows, setRows] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [roleName, setRoleName] = useState("");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedRowToDelete, setSelectedRowToDelete] = useState(null);

  const handleGetAllRoles = async () => {
    try {
      const response = await allRoles();

      setRows(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddRole = async () => {
    try {
      await createRole({ name: roleName });

      handleGetAllRoles();

      setOpenModal(false);

      alert("Role was successfully created");

      setRoleId("");
      setRoleName("");
    } catch (error) {
      alert(error.response.data.message || "Error when add role");
    }
  };

  const handleEditRole = async () => {
    try {
      await updateRole({ id: roleId, name: roleName });

      handleGetAllRoles();

      setOpenModal(false);

      alert("Role was successfully updated");

      setRoleId("");
      setRoleName("");
    } catch (error) {
      alert(error.response.data.message || "Error when edit role");
    }
  };

  const handleDeleteRole = async () => {
    try {
      await deleteRole({ id: selectedRowToDelete.id });

      handleGetAllRoles();

      alert("Role was successfully deleted");

      setDeleteConfirmOpen(false);
      setSelectedRowToDelete(null);
    } catch (error) {
      alert(error.response.data.message || "Error when delete role");
    }
  };

  const onEdit = (row) => {
    setOpenModal(true);
    setRoleId(row.id);
    setRoleName(row.name);
  };

  const onDelete = (row) => {
    setSelectedRowToDelete(row);
    setDeleteConfirmOpen(true);
  };

  useEffect(() => {
    handleGetAllRoles();
  }, []);

  const columns = getRoleColumns({
    onEdit: onEdit,
    onDelete: onDelete,
  });

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
            <Header title="Role Management" />

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
                Role Data{" "}
                <Button variant="contained" onClick={() => setOpenModal(true)}>
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
                Add New Role
              </Typography>
              <TextField
                label="Role Name"
                variant="outlined"
                fullWidth
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                sx={{ my: 2 }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={roleId ? handleEditRole : handleAddRole}
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
                <strong>{selectedRowToDelete?.name}</strong>?
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
