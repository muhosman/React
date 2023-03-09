import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const Alerts = function ({ AlertChoice, message }) {
  if (AlertChoice === 1) {
    return (
      <Alert severity="success">
        <AlertTitle>Başarılı</AlertTitle>
        <strong>{message}</strong>
      </Alert>
    );
  } else if (AlertChoice === 2) {
    return (
      <Alert severity="error">
        <AlertTitle>Hata</AlertTitle>
        <strong>{message}</strong>
      </Alert>
    );
  } else if (AlertChoice === 3) {
    return (
      <Alert severity="warning">
        <AlertTitle>! Dikkat !</AlertTitle>
        This is a warning alert — <strong>check it out!</strong>
      </Alert>
    );
  } else return <></>;
};

export default Alerts;
