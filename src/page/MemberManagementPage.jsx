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

import {
  allMembers,
  createMember,
  deleteMember,
  updateMember,
} from "../api/member";
import { getMemberColumns } from "../datatable/memberTable";
import { Button, Modal, TextField, Typography } from "@mui/material";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function MemberManagementPage(props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [selectedMember, setSelectedMember] = useState(null);

  const [rows, setRows] = useState([]);

  const [openModal, setOpenModal] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleGetAllMember = async () => {
    try {
      const response = await allMembers();

      setRows(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddMember = async () => {
    try {
      await createMember(form);

      handleGetAllMember();

      setOpenModal(false);

      alert("Member was successfully created");

      setForm({
        name: "",
        email: "",
      });
    } catch (error) {
      alert(error.response.data.message || "Error when add Member");
    }
  };

  const handleEditMember = async () => {
    try {
      await updateMember(form);

      handleGetAllMember();

      setOpenModal(false);

      alert("Member was successfully updated");

      setForm({
        name: "",
        email: "",
      });
    } catch (error) {
      alert(error.response.data.message || "Error when edit Member");
    }
  };

  const handleDeleteRole = async () => {
    try {
      await deleteMember({ id: selectedMember.id });

      handleGetAllMember();

      alert("Member was successfully deleted");

      setDeleteConfirmOpen(false);
      setSelectedMember(null);
    } catch (error) {
      alert(error.response.data.message || "Error when delete Member");
    }
  };

  const onEdit = (row) => {
    setOpenModal(true);
    setSelectedMember(row);
    setForm(row);
  };

  const onDelete = (row) => {
    setSelectedMember(row);
    setDeleteConfirmOpen(true);
  };

  useEffect(() => {
    handleGetAllMember();
  }, []);

  const columns = getMemberColumns({
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
            <Header title="Member Management" />

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
                Member Data{" "}
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedMember(null);
                    setOpenModal(true);
                    setForm({
                      name: "",
                      email: "",
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
                {selectedMember ? "Edit Member" : "Add New Member"}
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
              <Button
                variant="contained"
                fullWidth
                onClick={selectedMember ? handleEditMember : handleAddMember}
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
                <strong>{selectedMember?.name}</strong>?
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
