import { IconButton, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function renderDate(isoString) {
  const date = new Date(isoString);

  // Opsi formatter untuk Indonesia (WIB = UTC+7)
  const options = {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  // Format ke Bahasa Indonesia
  const formatted = new Intl.DateTimeFormat("id-ID", options).format(date);

  return formatted;
}

export const getMemberColumns = ({ onEdit, onDelete }) => [
  { field: "id", headerName: "ID", flex: 1.5, minWidth: 200 },
  {
    field: "name",
    headerName: "Name",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "created_at",
    headerName: "Created At",
    flex: 1,
    minWidth: 80,
    renderCell: (params) => renderDate(params.value),
  },
  {
    field: "updated_at",
    headerName: "Updated At",
    flex: 1,
    minWidth: 80,
    renderCell: (params) => renderDate(params.value),
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 0.8,
    minWidth: 120,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Stack direction="row" spacing={1}>
        <IconButton
          color="primary"
          size="small"
          onClick={() => onEdit(params.row)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          color="error"
          size="small"
          onClick={() => onDelete(params.row)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    ),
  },
];

export const getAuditColumns = [
  {
    field: "created_at",
    headerName: "Date",
    flex: 1.5,
    minWidth: 200,
    renderCell: (params) => renderDate(params.value),
  },
  {
    field: "event",
    headerName: "Action",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "user",
    headerName: "User",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "id",
    headerName: "Note",
    flex: 1,
    minWidth: 80,
    renderCell: (params) => `${params.row.event} ${params.row.model_type}`,
  },
];
