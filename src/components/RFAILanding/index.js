import React, { Fragment, useState } from "react";
import axios from "axios";
import Audiorecorder from "./Audiorecorder";
import { withStyles } from "@material-ui/styles";
import Footer from "../common/Footer";
import { useStyles } from "./styles";
import { Button } from "@material-ui/core";
const FileTypes = { COUGH: "COUGH", BREATH: "BREATH", VOWEL: "VOWEL" };

const RFAILanding = ({ classes }) => {
  const [values, setValues] = useState({
    [FileTypes.COUGH]: undefined,
    [FileTypes.BREATH]: undefined,
    [FileTypes.VOWEL]: undefined,
    error: undefined,
    result: undefined,
    isProcessing: false,
  });
  const handleFilerecorded = (file, FileType) => {
    console.log(file);
    console.log(FileType);
    setValues({ ...values, [FileType]: file });
  };
  const handleVowelfile = (file) => {
    handleFilerecorded(file, FileTypes.VOWEL);
  };
  const handleCoughfile = (file) => {
    handleFilerecorded(file, FileTypes.COUGH);
  };
  const handleBreathfile = (file) => {
    handleFilerecorded(file, FileTypes.BREATH);
  };

  const invokeCoughService = async () => {
    const payload = new FormData();
    payload.append("coughFile", values[FileTypes.COUGH]);
    payload.append("breathFile", values[FileTypes.BREATH]);
    payload.append("vowelFile", values[FileTypes.VOWEL]);
    const endpoint =
      "https://cough-service-api.singularitynet.io/coviddetection";
    setValues({ ...values, error: "", isProcessing: true });
    try {
      const response = await axios.post(endpoint, payload);
      setValues({ ...values, result: response.data, isProcessing: false });
    } catch (err) {
      setValues({
        ...values,
        error: err.response?.data.error,
        isProcessing: false,
      });
    }
  };

  return (
    <Fragment>
      <div className={classes.disabledPortalMainContainer}>
        <div className={classes.disabledPortalMainWrapper}>
          <div className={classes.letterMainContainer}>
            <span>Cough-Service</span>
            <div className={classes.letterContainer}>
              <div className={classes.letterBody}>
                <Audiorecorder
                  onFilerecorder={handleVowelfile}
                  title="Record Vowel"
                />

                <Audiorecorder
                  onFilerecorder={handleBreathfile}
                  title="Record Breath"
                />
                <Audiorecorder
                  onFilerecorder={handleCoughfile}
                  title="Record Cough"
                />
                <Button
                  style={{ marginTop: "30px" }}
                  variant="contained"
                  color="primary"
                  onClick={invokeCoughService}
                  disabled={values.isProcessing}
                >
                  Invoke
                </Button>
                <p style={{ marginTop: 20 }}>{JSON.stringify(values.result)}</p>
                <p style={{ marginTop: 20 }}>{values.error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};

export default withStyles(useStyles)(RFAILanding);
