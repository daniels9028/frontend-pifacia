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
  exportMember,
  importMember,
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

const availableFields = ["name", "email"];

export default function MemberManagementPage(props) {
  const [selectedFields, setSelectedFields] = useState([]);

  const [importFile, setImportFile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [selectedMember, setSelectedMember] = useState(null);

  const [rows, setRows] = useState([]);

  const [openModal, setOpenModal] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleFieldChange = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

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

  const handleExport = async () => {
    try {
      const response = await exportMember({ fields: selectedFields });

      if (response?.file_url) {
        const fileUrl = response.file_url.startsWith("http")
          ? response.file_url
          : `http://localhost:8000${response.file_url}`;
        window.open(fileUrl, "_blank");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      alert("Pilih file terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("file", importFile);

    try {
      await importMember(formData);

      alert("File berhasil diupload. Import sedang diproses.");
      setImportFile(null);
      handleGetAllMember(); // Refresh data
    } catch (error) {
      console.error(error);
      alert("Gagal mengimpor file.");
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

            <Box sx={{ mt: 3 }}>
              <h2 className="text-lg font-bold">Import Member</h2>
              <input
                type="file"
                accept=".xlsx"
                onChange={(e) => setImportFile(e.target.files[0])}
              />
              <Button
                onClick={handleImport}
                disabled={!importFile}
                variant="outlined"
              >
                Import
              </Button>
            </Box>

            <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
              <h2 className="text-lg font-bold">Export Member</h2>
              {availableFields.map((field) => (
                <label key={field} className="block">
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field)}
                    onChange={() => handleFieldChange(field)}
                  />
                  <span className="ml-2">{field}</span>
                </label>
              ))}

              <Button
                variant="outlined"
                sx={{ ml: 2 }}
                onClick={handleExport}
                disabled={selectedFields.length === 0}
              >
                Export
              </Button>
            </Box>

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
