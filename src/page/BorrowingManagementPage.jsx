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
  allBorrowings,
  createBorrowing,
  deleteBorrowing,
  updateBorrowing,
  getFormOptions,
  exportBorrowing,
  importBorrowing,
} from "../api/borrowing";
import { auditBorrowing } from "../api/audit";

import {
  getBorrowingColumns,
  getAuditColumns,
} from "../datatable/borrowingTable";

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

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const availableFields = ["book_id", "member_id", "borrowed_at", "notes"];

export default function BorrowingManagementPage(props) {
  const [selectedFields, setSelectedFields] = useState([]);

  const [importFile, setImportFile] = useState(null);

  const [form, setForm] = useState({
    book_id: "",
    member_id: "",
    borrowed_at: "",
    attachment: null,
    notes: {
      condition: "",
      remarks: "",
    },
  });

  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  const [selectedBorrowing, setSelectedBorrowing] = useState(null);

  const [rows, setRows] = useState([]);
  const [auditRows, setAuditRows] = useState([]);

  const [openModal, setOpenModal] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleFieldChange = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleGetFormOptions = async () => {
    try {
      const response = await getFormOptions();

      setBooks(response.books);
      setMembers(response.members);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllBorrowings = async () => {
    try {
      const response = await allBorrowings();
      const responseAudit = await auditBorrowing();

      setRows(response.data);
      setAuditRows(responseAudit.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddBorrowing = async () => {
    if (form.attachment && form.attachment.size > 512000) {
      alert("File size must be less than 500KB");
      return;
    }

    try {
      await createBorrowing(form);

      handleGetAllBorrowings();

      setOpenModal(false);

      alert("Borrowing was successfully created");

      setForm({
        book_id: "",
        member_id: "",
        borrowed_at: "",
        attachment: null,
        notes: {
          condition: "",
          remarks: "",
        },
      });
    } catch (error) {
      alert(error.response.data.message || "Error when add borrowing");
    }
  };

  const handleEditBorrowing = async () => {
    try {
      await updateBorrowing({ ...form, id: selectedBorrowing.id });

      handleGetAllBorrowings();

      setOpenModal(false);

      alert("Borrowing was successfully updated");

      setForm({
        book_id: "",
        member_id: "",
        borrowed_at: "",
        attachment: null,
        notes: {
          condition: "",
          remarks: "",
        },
      });
    } catch (error) {
      alert(error.response.data.message || "Error when edit borrowing");
    }
  };

  const handleDeleteRole = async () => {
    try {
      await deleteBorrowing({ id: selectedBorrowing.id });

      handleGetAllBorrowings();

      alert("Borrowing was successfully deleted");

      setDeleteConfirmOpen(false);
      setSelectedBorrowing(null);
    } catch (error) {
      alert(error.response.data.message || "Error when delete borrowing");
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportBorrowing({ fields: selectedFields });

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
      await importBorrowing(formData);

      alert("File berhasil diupload. Import sedang diproses.");
      setImportFile(null);
      handleGetAllBorrowings(); // Refresh data
    } catch (error) {
      console.error(error);
      alert("Gagal mengimpor file.");
    }
  };

  const onEdit = (row) => {
    setOpenModal(true);

    setSelectedBorrowing(row);

    setForm({
      book_id: row.book_id,
      member_id: row.member_id,
      borrowed_at: row.borrowed_at.slice(0, 10),
      attachment: null,
      notes: {
        condition: row.notes.condition,
        remarks: row.notes.remarks,
      },
    });
  };

  const onDelete = (row) => {
    setSelectedBorrowing(row);
    setDeleteConfirmOpen(true);
  };

  useEffect(() => {
    handleGetAllBorrowings();
    handleGetFormOptions();
  }, []);

  const columns = getBorrowingColumns({
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
            <Header title="Borrowing Management" />

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
                Borrowing Data{" "}
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedBorrowing(null);
                    setOpenModal(true);
                    setForm({
                      book_id: "",
                      member_id: "",
                      borrowed_at: "",
                      attachment: null,
                      notes: {
                        condition: "",
                        remarks: "",
                      },
                    });
                  }}
                >
                  Add
                </Button>
              </Typography>
            </Box>

            <MainGrid columns={columns} rows={rows} />

            <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
              <h2 className="text-lg font-bold">Audit & Note</h2>
            </Box>

            <MainGrid columns={getAuditColumns} rows={auditRows} />
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
                {selectedBorrowing ? "Edit Borrowing" : "Add New Borrowing"}
              </Typography>
              <FormControl fullWidth sx={{ my: 2 }}>
                <InputLabel id="book-label">Book</InputLabel>
                <Select
                  labelId="book-label"
                  id="book"
                  value={form.book_id}
                  label="Book"
                  onChange={(e) =>
                    setForm({ ...form, book_id: e.target.value })
                  }
                >
                  {books.map((book) => (
                    <MenuItem value={book.id} key={book.id}>
                      {book.title} | {book.author}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ my: 2 }}>
                <InputLabel id="member-label">Member</InputLabel>
                <Select
                  labelId="member-label"
                  id="member"
                  value={form.member_id}
                  label="Member"
                  onChange={(e) =>
                    setForm({ ...form, member_id: e.target.value })
                  }
                >
                  {members.map((member) => (
                    <MenuItem value={member.id} key={member.id}>
                      {member.name} | {member.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Borrowed At"
                fullWidth
                value={form.borrowed_at}
                type="date"
                onChange={(e) =>
                  setForm({
                    ...form,
                    borrowed_at: e.target.value,
                  })
                }
                sx={{ my: 2 }}
              />

              <TextField
                label="Condition"
                fullWidth
                value={form.notes.condition}
                onChange={(e) =>
                  setForm({
                    ...form,
                    notes: {
                      ...form.notes,
                      condition: e.target.value,
                    },
                  })
                }
                sx={{ my: 2 }}
              />

              <TextField
                label="Remarks"
                fullWidth
                value={form.notes.remarks}
                onChange={(e) =>
                  setForm({
                    ...form,
                    notes: {
                      ...form.notes,
                      remarks: e.target.value,
                    },
                  })
                }
                sx={{ my: 2 }}
              />

              <input
                type="file"
                accept="application/pdf"
                style={{ marginBottom: 8, marginTop: 8 }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.size > 512000) {
                    alert("File size must be less than 500KB");
                    return;
                  }
                  setForm({ ...form, attachment: file });
                }}
              />

              <Button
                variant="contained"
                fullWidth
                onClick={
                  selectedBorrowing ? handleEditBorrowing : handleAddBorrowing
                }
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
                <strong>{selectedBorrowing?.name}</strong>?
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
