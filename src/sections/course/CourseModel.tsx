import { useCallback, useEffect, useState } from 'react';
// @mui
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogProps,
  Box,
  Grid,
  Typography,
  MenuItem,
} from '@mui/material';
import FormProvider from 'src/components/hook-form/FormProvider';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { RHFUpload } from 'src/components/hook-form/RHFUpload';
import { RHFMultiSelect, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFlashCardForAdmin } from 'src/store/slices/flashCardSlice';
import { createCourse, updateCourse } from 'src/store/slices/courseSlice';
import { RootState } from 'src/store/store';
import { LoadingButton } from '@mui/lab';
// ----------------------------------------------------------------------

interface Props extends DialogProps {
  selectedRow?: any;
  open: boolean;
  onClose: VoidFunction;
  editId?: number;
}

type FormValuesProps = {
  name: string;
  level: string;
  language: string;
  course_image: any;
  flash_card_array: any;
  subscription_type: any;
};

const FormSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  level: Yup.string().required('Level is required'),
  language: Yup.string().required('Language is required'),
  course_image: Yup.mixed().required('Course image is required'),
  flash_card_array: Yup.array().required('Flash card is required'),
  subscription_type: Yup.string().required('Subscription type image is required'),
});

export default function CourseModel({ open, selectedRow = {}, editId = -1, onClose }: Props) {
  const { flashCardData } = useSelector((state: RootState) => state.flashCard);
  const { createCourseLoading, updateCourseLoading } = useSelector(
    (state: RootState) => state.course
  );
  const dispatch = useDispatch();
  const [url, setUrl] = useState<any>('');
  const defaultValues = {
    name: '',
    lavel: '',
    language: '',
    course_image: null,
    subscription_type: '',
    flash_card_array: [],
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { dirtyFields },
  } = methods;

  const onSubmit = (data: any) => {
    const changedValues = Object.keys(dirtyFields).reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {} as Partial<any>);
    const formData = new FormData();
    if (Object.keys(selectedRow)?.length > 0) {
      if (changedValues?.name) {
        formData.append('name', data.name);
      }
      if (changedValues?.level) {
        formData.append('level', data.level);
      }
      if (changedValues?.language) {
        formData.append('language', data.language);
      }
      if (changedValues?.course_image) {
        formData.append('course_image', data.course_image);
      }
      if (changedValues?.flash_card_array) {
        formData.append('flash_card_array', JSON.stringify(data?.flash_card_array));
      }
      if (changedValues?.subscription_type) {
        formData.append('subscription_type', data?.subscription_type);
      }
      dispatch(updateCourse(formData, editId));
    } else {
      formData.append('name', data.name);
      formData.append('level', data.level);
      formData.append('language', data.language);
      formData.append('course_image', data.course_image);
      formData.append('flash_card_array', JSON.stringify(data?.flash_card_array));
      formData.append('subscription_type', data?.subscription_type);
      dispatch(createCourse(formData));
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      setUrl(newFile);

      if (file) {
        setValue('course_image', file, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = () => {
    setValue('course_image', null);
  };

  useEffect(() => {
    if (Object.keys(selectedRow)?.length > 0) {
      const flashCards =
        selectedRow?.FlashCards?.length > 0
          ? selectedRow?.FlashCards?.map((item: any) => item?.id)
          : [];
      const data = {
        name: selectedRow?.name,
        level: selectedRow?.level,
        language: selectedRow.language,
        course_image: selectedRow?.image,
        flash_card_array: flashCards,
        subscription_type: selectedRow?.subscription_type,
      };
      reset(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow]);

  useEffect(() => {
    dispatch(getAllFlashCardForAdmin());
  }, [dispatch]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          paddingTop: 2,
          paddingX: 3,
          paddingBottom: 0,
        }}
      >
        Create Course
      </DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid paddingY={2} container spacing={2}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="name" label="Enter Name" />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFSelect
                name="level"
                label="Select level"
                sx={{
                  '& select': {
                    background: '#fff !important',
                    color: '#000',
                    fontWeight: 600,
                    fontFamily: 'Work Sans,sans-serif',
                  },
                }}
              >
                <MenuItem disabled value="">
                  None
                </MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFSelect
                name="language"
                label="Select language"
                sx={{
                  '& select': {
                    background: '#fff !important',
                    color: '#000',
                    fontWeight: 600,
                    fontFamily: 'Work Sans,sans-serif',
                  },
                }}
              >
                <MenuItem disabled value="">
                  None
                </MenuItem>
                <MenuItem value="french">French</MenuItem>
                <MenuItem value="german">German</MenuItem>
                <MenuItem value="ltalian">Italian</MenuItem>
                <MenuItem value="spanish">Spanish</MenuItem>
                <MenuItem value="english">English</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="subscription_type" label="Enter subscription type" />
            </Grid>
            <Grid item xs={12}>
              <RHFMultiSelect
                fullWidth
                name="flash_card_array"
                options={flashCardData?.rows?.map((item: any) => ({
                  value: item?.id,
                  label: item?.term,
                }))}
                label="Select Flashcard"
                sx={{
                  width: '100%',
                  '& select': {
                    background: '#fff !important',
                    color: '#000',
                    fontWeight: 600,
                    fontFamily: 'Work Sans,sans-serif',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h6" lineHeight={1} gutterBottom>
                    Upload Image
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <RHFUpload
                    name="course_image"
                    maxSize={3145728}
                    files={url}
                    onDrop={handleDrop}
                    onDelete={handleRemoveFile}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  paddingY: 3,
                  flexDirection: 'row',
                  gap: 1,
                }}
              >
                <Button onClick={onClose} color="inherit">
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  loading={
                    Object.keys(selectedRow)?.length > 0 ? updateCourseLoading : createCourseLoading
                  }
                  loadingPosition="start"
                  variant="contained"
                >
                  {updateCourseLoading === false && createCourseLoading === false && (
                    <span>Save</span>
                  )}
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
