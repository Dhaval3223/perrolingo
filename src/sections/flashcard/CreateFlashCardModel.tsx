import { useCallback, useEffect, useState } from 'react';
// @mui
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogProps,
  Box,
  IconButton,
  Grid,
  Typography,
  MenuItem,
} from '@mui/material';
import FormProvider from 'src/components/hook-form/FormProvider';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { RHFUpload } from 'src/components/hook-form/RHFUpload';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify/Iconify';
import { useDispatch, useSelector } from 'react-redux';
import { createFlashCardForAdmin, updateFlashCardForAdmin } from 'src/store/slices/flashCardSlice';
import { LoadingButton } from '@mui/lab';
import { RootState } from 'src/store/store';
// ----------------------------------------------------------------------

interface Props extends DialogProps {
  selectedRow?: any;
  open: boolean;
  onClose: VoidFunction;
  editId?: number;
}

type FormValuesProps = {
  term: string;
  definition: string;
  phrase: string;
  language: string;
  flashcard_image: any;
  similarWords: any;
  flashcard_audio: any;
};

const FormSchema = Yup.object().shape({
  term: Yup.string().required('Term is required'),
  definition: Yup.string().required('Definition is required'),
  phrase: Yup.string().required('Phrase is required'),
  language: Yup.string().required('Language is required'),
  flashcard_image: Yup.mixed().required('FlashCard image is required'),
  similarWords: Yup.array().of(
    Yup.object().shape({
      word: Yup.string().required('Word is required'),
    })
  ),
  flashcard_audio: Yup.mixed().required('FlashCard Audio is required'),
});

export default function CreateFlashCardModel({
  open,
  selectedRow = {},
  editId = -1,
  onClose,
}: Props) {
  const dispatch = useDispatch();
  const {
    createFlashDataLoading,
    updateFlashDataLoading,
    createFlashDataSuccess,
    updateFlashDataSuccess,
  } = useSelector((state: RootState) => state.flashCard);
  const [url, setUrl] = useState<any>('');
  const [audioUrl, setAudioUrl] = useState<any>('');
  const defaultValues = {
    term: '',
    definition: '',
    phrase: '',
    language: '',
    flashcard_image: null,
    similarWords: [
      {
        word: '',
      },
    ],
    flashcard_audio: null,
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { dirtyFields },
  } = methods;

  const simpleWordsArr = useFieldArray({
    control,
    name: 'similarWords',
  });

  const onSubmit: SubmitHandler<any> = (data: any) => {
    const changedValues = Object.keys(dirtyFields).reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {} as Partial<any>);

    const formData = new FormData();
    if (Object.keys(selectedRow)?.length > 0) {
      if (changedValues?.term) {
        formData.append('term', changedValues.term);
      }
      if (changedValues?.definition) {
        formData.append('definition', changedValues.definition);
      }
      if (changedValues?.phrase) {
        formData.append('phrase', changedValues.phrase);
      }
      if (changedValues?.language) {
        formData.append('language', changedValues.language);
      }
      if (url?.length > 0) {
        formData.append('flashcard_image', data.flashcard_image);
      }
      if (audioUrl?.length > 0) {
        formData.append('flashcard_audio', data.flashcard_audio);
      }
      if (changedValues?.similarWords?.length > 0) {
        changedValues?.similarWords?.forEach((item: any, index: number) => {
          // Append each item's data to FormData
          formData.append(`similarWords[${index}]`, item?.word);
        });
      }
      dispatch(updateFlashCardForAdmin(formData, editId));
    } else {
      formData.append('term', data.term);
      formData.append('definition', data.definition);
      formData.append('phrase', data.phrase);
      formData.append('language', data.language);
      formData.append('flashcard_image', data.flashcard_image);
      formData.append('flashcard_audio', data.flashcard_audio);
      if (data?.similarWords?.length > 0) {
        data?.similarWords?.forEach((item: any, index: number) => {
          // Append each item's data to FormData
          formData.append(`similarWords[${index}]`, item?.word);
        });
      }
      dispatch(createFlashCardForAdmin(formData));
    }
    if (createFlashDataSuccess || updateFlashDataSuccess) {
      setUrl('');
      setAudioUrl('');
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (Object.keys(selectedRow)?.length > 0) {
        setUrl(acceptedFiles);
      } else {
        setUrl(newFile);
      }

      if (file) {
        setValue('flashcard_image', file, { shouldValidate: true });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setValue]
  );

  const handleAudioDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (Object.keys(selectedRow)?.length > 0) {
        setAudioUrl(acceptedFiles);
      } else {
        setAudioUrl(newFile);
      }
      if (file) {
        setValue('flashcard_audio', file, { shouldValidate: true });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setValue]
  );

  const handleRemoveFile = () => {
    setValue('flashcard_image', null);
  };

  const handleAudioRemoveFile = () => {
    setValue('flashcard_audio', null);
  };

  useEffect(() => {
    if (Object.keys(selectedRow)?.length > 0) {
      const data = {
        term: selectedRow?.term,
        definition: selectedRow?.definition,
        phrase: selectedRow?.phrase,
        language: selectedRow.language,
        flashcard_image: selectedRow?.image,
        similarWords: selectedRow?.SimilarWords,
        flashcard_audio: selectedRow?.audio,
      };
      reset(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          paddingTop: 2,
          paddingX: 3,
          paddingBottom: 0,
        }}
      >
        Create Flash Card
      </DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid paddingY={2} container spacing={2}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="term" label="Enter Term" />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="definition" label="Enter Definition" />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="phrase" label="Enter Phrase" />
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

            <Grid item xs={12}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" lineHeight={1}>
                      Similar Words
                    </Typography>
                    <IconButton onClick={() => simpleWordsArr.append({ word: '' })}>
                      <Iconify icon="eva:plus-fill" />
                    </IconButton>
                  </Box>
                </Grid>
                {simpleWordsArr?.fields?.map((item, index) => (
                  <>
                    <Grid item xs={11}>
                      <RHFTextField name={`similarWords[${index}].word`} label="Enter Word" />
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton
                        onClick={() => {
                          simpleWordsArr.remove(index);
                        }}
                      >
                        <Iconify icon="eva:trash-2-outline" />
                      </IconButton>
                    </Grid>
                  </>
                ))}
              </Grid>
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
                    name="flashcard_image"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    onDelete={handleRemoveFile}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h6" lineHeight={1} gutterBottom>
                    Upload Audio
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <RHFUpload
                    accept=".mp3,.wav,.ogg"
                    name="flashcard_audio"
                    maxSize={3145728}
                    onDrop={handleAudioDrop}
                    onDelete={handleAudioRemoveFile}
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
                    Object.keys(selectedRow)?.length > 0
                      ? updateFlashDataLoading
                      : createFlashDataLoading
                  }
                  loadingPosition="start"
                  variant="contained"
                >
                  {updateFlashDataLoading === false && createFlashDataLoading === false && (
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
