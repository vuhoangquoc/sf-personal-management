import { LoadingButton } from "@mui/lab";
import { Box, Stack, TextField,Alert } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import userApi from "../../api/moudules/user.api.js";
import { setUser } from "../../Redux/Reducer/userSlice";
import { setAuthModalOpen } from "../../Redux/Reducer/authSlice";

const PasswordUpdate = () => {
  const [onRequest, setOnRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: ""
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "mật khẩu tối thiểu 8 ký tự")
        .required("mật khẩu là bắt buộc"),
      newPassword: Yup.string()
        .min(8, "mật khẩu mới tối thiểu 8 ký tự")
        .required("mật khẩu mới là bắt buộc"),
            confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "xác nhậnMật khẩu mới không khớp")
        .min(8, "xác nhận Mật khẩu mới tối thiểu 8 ký tự")
        .required("xác nhận Mật khẩu mới là bắt buộc")
    }),
    onSubmit: async values => onUpdate(values)
  });

  const onUpdate = async (values) => {
    if (onRequest) return;
    setOnRequest(true);
    setErrorMessage(undefined);

    const { response, err } = await userApi.passwordUpdate(values);

    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      form.resetForm();
      navigate("/");
      dispatch(setUser(null));
      dispatch(setAuthModalOpen(true));
      toast.success("Cập nhật mật khẩu thành công! Vui lòng đăng nhập lại");
    }
    if (err) setErrorMessage(err.message);
  };

  return (
    <div>
        <Box component="form" maxWidth="400px" onSubmit={form.handleSubmit}>
          <Stack spacing={2}>
            <TextField
              type="password"
              placeholder="Mật khẩu cũ "
              name="password"
              fullWidth
              value={form.values.password}
              onChange={form.handleChange}
              color="success"
              error={form.touched.password && form.errors.password !== undefined}
              helperText={form.touched.password && form.errors.password}
            />
            <TextField
              type="password"
              placeholder="Mật khẩu mới "
              name="newPassword"
              fullWidth
              value={form.values.newPassword}
              onChange={form.handleChange}
              color="success"
              error={form.touched.newPassword && form.errors.newPassword !== undefined}
              helperText={form.touched.newPassword && form.errors.newPassword}
            />
            <TextField
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              name="confirmNewPassword"
              fullWidth
              value={form.values.confirmNewPassword}
              onChange={form.handleChange}
              color="success"
              error={form.touched.confirmNewPassword && form.errors.confirmNewPassword !== undefined}
              helperText={form.touched.confirmNewPassword && form.errors.confirmNewPassword}
            />

            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: 4 }}
              loading={onRequest}
            >
              ĐỔI MẬT KHẨU
            </LoadingButton>
            
          </Stack>
          {errorMessage && (
            <Box sx={{ marginTop: 2 }}>
              <Alert variant="filled" severity="error">
                 mật khẩu cũ không chính xác!
            </Alert>
          </Box>
          )}
        </Box>
    </div>
  );
};

export default PasswordUpdate;