import React, { useState, useEffect, useMemo, memo } from 'react';
import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  InputBase,
} from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/admin/AdminLayout';
import { useSelector } from 'react-redux';
import Loading from '../../components/Loading';
import axios from 'axios';

function SendGroupMessage() {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [loader, setLoader] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const lang = Cookies.get('i18next') || 'en';
  const { t } = useTranslation();
  const { token } = useSelector((state) => state.admin);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setSearchValue(searchInput); // تحديث قيمة البحث بعد 100ms من التوقف عن الكتابة
    }, 100); // تم تقليل التأخير إلى 100ms

    return () => clearTimeout(delaySearch); // تنظيف التايمر عند تغيير القيمة
  }, [searchInput]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUser([]); // إلغاء التحديد
    } else {
      const allEmails = filteredData.map((d) => d.email); // اختيار جميع الأشخاص المتاحين
      setSelectedUser(allEmails);
    }
    setSelectAll(!selectAll);
  };

  const handleSelect = (email) => {
    setSelectedUser((prevSelected) => {
      const newSelected = prevSelected.includes(email)
        ? prevSelected.filter((personId) => personId !== email)
        : [...prevSelected, email];

      // تحديث حالة تحديد الكل بناءً على ما إذا كان كل العناصر محددة أم لا
      setSelectAll(newSelected.length === filteredData.length);
      return newSelected;
    });
  };

  const getAllSelectedPeople = () => {
    const selectedIds = selectedUser;
    return data.filter((person) => selectedIds.includes(person.email));
  };

  const normalizedSearch = searchValue.trim().toLowerCase(); // تصفية البحث مرة واحدة فقط

  const filteredData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return []; // تأكد من أن البيانات موجودة

    return data.filter((d) => {
      const name = (selectedCategory === "teacher" ? `${d.firstName} ${d.lastName}` : d.name || "").toLowerCase();
      return name.includes(normalizedSearch);
    });
  }, [data, normalizedSearch, selectedCategory]);

  const handleCategoryChange = async (event) => {
    setSelectedCategory(event.target.value);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_KEY}api/v1/admin/getall/${event.target.value}`);
      setData(response.data.data);
    } catch (err) {
      const errMsg =
        err.message === 'timeout of 2000ms exceeded'
          ? 'Server timeout responding'
          : err.response.data.message;
      enqueueSnackbar(errMsg, { variant: 'error', autoHideDuration: 5000 });
    }
  };

  const handleMethodChange = (event) => {
    const value = event.target.value;
    setSelectedMethods((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const sendMail = async (event) => {
    event.preventDefault();
    const value = event.target.message.value;
    const selectedPeople = getAllSelectedPeople();

    try {
      let endpoint = `${process.env.REACT_APP_API_KEY}api/v1/admin/send-bulk-messages`;
      const res = await axios.post(
        endpoint,
        { message: value, selectedMethods, selectedPeople, selectedCategories, lang },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );
      if (res.status === 200) setLoader(false);
      const resMessage = res.data.message;
      const message = lang === 'en' ? resMessage.en : resMessage.ar;
      enqueueSnackbar(message, { variant: 'success', autoHideDuration: 5000 });
    } catch (error) {
      enqueueSnackbar(t('error'), { variant: 'error', autoHideDuration: 5000 });
    }
  };

  return (
    <AdminLayout>
      {loader ? (
        <Loading />
      ) : (
        <>
          <FormLabel component="legend" className="mt-2">
            {t('Choose the category you want to send to')}
          </FormLabel>
          <FormControl component="fieldset" margin="dense">
            <RadioGroup value={selectedCategory} onChange={handleCategoryChange}>
              <FormControlLabel
                control={<Radio />}
                label={t('teachers')}
                value="teacher"
              />
              <FormControlLabel
                control={<Radio />}
                label={t('students')}
                value="student"
              />
              <FormControlLabel
                control={<Radio />}
                label={t('parents')}
                value="parent"
              />
            </RadioGroup>
          </FormControl>

          <form onSubmit={sendMail}>
            <FormControl component="fieldset" margin="dense">
              <>
                {!data.length ? (
                  <>
                  </>
                ) : (
                  <>
                    <FormLabel component="legend">
                      {t('Choose the people you want to send a message to')}
                    </FormLabel>
                    <Paper sx={{ width: '100%', p: '2px 4px', marginBottom: '20px', display: 'flex', alignItems: 'center', marginTop: '0.2rem' }}>
                      <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder={t('search')}
                        onChange={(e) => {
                          setSearchInput(e.target.value); // تحديث searchInput مباشرةً
                          setSearchValue(e.target.value); // تحديث searchValue مباشرةً
                        }}
                      />
                    </Paper>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">
                              <Checkbox checked={selectAll} onChange={handleSelectAll} />
                            </TableCell>
                            <TableCell align="center">{t('Photo')}</TableCell>
                            <TableCell align="center">{t('name')}</TableCell>
                            <TableCell align="center">{t('email')}</TableCell>
                            <TableCell align="center">{t('phone')}</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {filteredData.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} align="center">
                                {t('No results found')}
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredData.map((d) => (
                              <PersonRow key={d.id} d={d} handleSelect={handleSelect} selectedUser={selectedUser} selectedCategory={selectedCategory} />
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </>

              <FormLabel component="legend" className="mt-2">
                {t('Choose the method of sending to users (you can choose more than one method)')}
              </FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedMethods.includes('email')}
                    onChange={handleMethodChange}
                    value="email"
                  />
                }
                label={t('email')}
              />
              {/* <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedMethods.includes('whatsapp')}
                    onChange={handleMethodChange}
                    value="whatsapp"
                  />
                }
                label={t('whatsapp')}
              /> */}
             {/*<FormControlLabel
                control={
                  <Checkbox
                    checked={selectedMethods.includes('sms')}
                    onChange={handleMethodChange}
                    value="sms"
                  />
                }
                label={t('SMS')}
              /> */}
            </FormControl>

            <FormControl fullWidth margin="dense">
              <TextareaAutosize
                required
                name="message"
                minRows={4}
                placeholder={t('mailPlaceholder')}
                style={{ width: '100%',padding:"0.5rem 1rem 0",fontSize:"16px" }}
              />
            </FormControl>

            <Button variant="contained" type="submit" sx={{ width: '300px', marginTop: '20px' }}>
              {t('send')}
            </Button>
          </form>
        </>
      )}
    </AdminLayout>
  );
}

const PersonRow = memo(({ d, handleSelect, selectedUser, selectedCategory }) => {
  const name = selectedCategory === "teacher" ? `${d.firstName} ${d.lastName}` : d.name;
  const phone = selectedCategory === "student" ? d.phoneNumber : d.phone;

  return (
    <TableRow key={d.id}>
      <TableCell>
        <Checkbox
          checked={selectedUser.includes(d.email)}
          onChange={() => handleSelect(d.email)}
        />
      </TableCell>
      <TableCell align="center">
        <img
          src={d?.image ? `${process.env.REACT_APP_API_KEY}images/${d.image}` : "/logo.png"}
          alt={d.image}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "30px"
          }}
        />
      </TableCell>
      <TableCell align="center">{name}</TableCell>
      <TableCell align="center">{d.email}</TableCell>
      <TableCell align="center">{phone}</TableCell>
    </TableRow>
  );
});

export default SendGroupMessage;