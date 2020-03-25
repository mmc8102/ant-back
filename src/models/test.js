import {
  saveOrUpdNotice,
  uploadUserImg,
  deleteNotice,
  getNotice,
  topNotice,
  getNoticeDetail,
} from '@/services/news';
import { notification } from 'antd';

export default {
  namespace: 'test',
  state: {
    list: {
      data: {
        total: 0,
        rows: [],
        totalPage: 5,
      },
    },
    current: {
      appEdition: '',
      type: '',
      remark: '',
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'loading',
      });
      const response = yield call(getNotice, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *saveOrUpdate({ payload }, { call, put }) {
      yield put({
        type: 'loading',
      });
      const response = yield call(saveOrUpdNotice, payload);
      if (response.code === 'SUCCESS') {
        notification.success({
          message: response.code,
          description: response.msg,
        });
      } else {
        notification.error({
          message: response.code,
          description: response.msg,
        });
      }
    },
    *upload({ payload }, { call, put }) {
      yield put({
        type: 'loading',
      });
      const response = yield call(uploadUserImg, payload);
      if (response.code === 'SUCCESS') {
        notification.success({
          message: response.code,
          description: response.msg,
        });
      } else {
        notification.error({
          message: response.code,
          description: response.msg,
        });
      }
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(deleteNotice, payload);
      if (response.code === 'SUCCESS') {
        const newFetch = yield call(getNotice, {});
        yield put({
          type: 'save',
          payload: newFetch,
        });
        notification.success({
          message: response.code,
          description: response.msg,
        });
      } else {
        notification.error({
          message: response.code,
          description: response.msg,
        });
      }
    },
    *details({ payload }, { call, put }) {
      const response = yield call(getNoticeDetail, payload);
      yield put({
        type: 'savedetails',
        payload: response.data,
      });
    },
    *clearDetails(_, { put }) {
      yield put({
        type: 'savedetails',
        payload: {},
      });
    },

    *top({ payload }, { call, put }) {
      const response = yield call(topNotice, payload);
      if (response.code === 'SUCCESS') {
        const newFetch = yield call(getNotice, {});
        yield put({
          type: 'save',
          payload: newFetch,
        });
        notification.success({
          message: response.code,
          description: response.msg,
        });
      } else {
        notification.error({
          message: response.code,
          description: response.msg,
        });
      }
    },

    *download({ payload }, { call, put }) {
      const response = yield call(downloadRAS, payload);
    },
  },
  reducers: {
    loading(state) {
      return {
        ...state,
        loading: true,
      };
    },

    save(state, action) {
      return {
        ...state,
        list: action.payload,
        loading: false,
      };
    },
    savedetails(state, action) {
      return {
        ...state,
        current: action.payload,
        loading: false,
      };
    },
    saveRAS(state, action) {
      return {
        ...state,
        merchInfoRAS: action.payload,
        loading: false,
      };
    },
    again(state, action) {
      return {
        ...state,
        merchInfoAgain: action.payload,
        loading: false,
      };
    },
  },
};
