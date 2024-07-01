import { useCallback, useEffect, useState } from 'react';
// @mui
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogProps,
  Box,
  Stack,
  IconButton,
  Grid,
  Typography,
} from '@mui/material';
import FormProvider from 'src/components/hook-form/FormProvider';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { RHFUpload } from 'src/components/hook-form/RHFUpload';
import { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify/Iconify';
import { useDispatch } from 'react-redux';
import { createFlashCardForAdmin, updateFlashCardForAdmin } from 'src/store/slices/flashCardSlice';
import { useSnackbar } from '../../components/snackbar';

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
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [url, setUrl] = useState<any>('');
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

  const { reset, control, setValue, handleSubmit } = methods;

  const simpleWordsArr = useFieldArray({
    control,
    name: 'similarWords',
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
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
    if (Object.keys(selectedRow)?.length > 0) {
      dispatch(updateFlashCardForAdmin(formData, editId));
      enqueueSnackbar('Flashcard updated successfully', { variant: 'success' });
    } else {
      dispatch(createFlashCardForAdmin(formData));
      enqueueSnackbar('Flashcard created successfully', { variant: 'success' });
    }

    onClose();
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      setUrl(newFile);

      if (file) {
        setValue('flashcard_image', file, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleAudioDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('flashcard_audio', file, { shouldValidate: true });
      }
    },
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
      console.log('selectedRow', selectedRow);
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
              <RHFTextField name="language" label="Enter Language" />
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
                    files={url}
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
                <Button variant="contained" type="submit">
                  Save
                </Button>
              </Box>
            </Grid>
          </Grid>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
