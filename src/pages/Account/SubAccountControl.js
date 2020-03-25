import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, Modal } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CryptoJS from 'crypto-js';

import styles from '../AuthorityControl/UserControl.less';

const FormItem = Form.Item;
const { Option } = Select;
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, roleList } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title="新建角色"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
        {form.getFieldDecorator('loginName', {
          rules: [{ required: true, message: '请输入至多10个字符！', max: 10 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
        {form.getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入至少五个字符的密码！', min: 5 }],
        })(<Input placeholder="请输入密码" type="password" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="昵称">
        {form.getFieldDecorator('realName', {
          rules: [{ required: true, message: '最多8个字符！', max: 8 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限">
        {form.getFieldDecorator('roleId', {
          rules: [{ required: true }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {roleList &&
              roleList.map(item => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.description}
                  </Option>
                );
              })}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机">
        {form.getFieldDecorator('mobile', {
          rules: [{ test: /^1\d{10}$/, message: '请输入正确的手机号码！', max: 11 }],
        })(<Input placeholder="请输入手机号码" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="电话">
        {form.getFieldDecorator('phone', {
          rules: [{ message: '最多15个字符！', max: 15 }],
        })(<Input placeholder="请输入电话号码" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮箱">
        {form.getFieldDecorator('email', {})(<Input placeholder="请输入邮箱" />)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
    roleList: [],
  };

  render() {
    const {
      updateModalVisible,
      handleUpdateModalVisible,
      handleUpdate,
      values,
      form,
      roleList,
    } = this.props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        if (values.id) {
          handleUpdate(fieldsValue, values.id);
        }
      });
    };
    return (
      <Modal
        maskClosable={false}
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="编辑角色"
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
          <Input placeholder="请输入" value={values.loginName} />
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="昵称">
          {form.getFieldDecorator('realName', {
            initialValue: values.realName,
            rules: [{ required: true, message: '最多8个字符！', max: 8 }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限">
          {form.getFieldDecorator('roleId', {
            initialValue: values.roleName,
            rules: [{ required: true }],
          })(
            <Select placeholder="请选择" style={{ width: '100%' }}>
              {roleList &&
                roleList.map(item => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.description}
                    </Option>
                  );
                })}
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机">
          {form.getFieldDecorator('mobile', {
            initialValue: values.mobile,
            rules: [{ test: /^1\d{10}$/, message: '请输入正确的手机号码！', max: 11 }],
          })(<Input placeholder="请输入手机号码" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="电话">
          {form.getFieldDecorator('phone', {
            initialValue: values.phone,
            rules: [{ message: '最多15个字符！', max: 15 }],
          })(<Input placeholder="请输入电话号码" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮箱">
          {form.getFieldDecorator('email', {
            initialValue: values.email,
          })(<Input placeholder="请输入邮箱" />)}
        </FormItem>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ user, role, loading }) => ({
  user,
  role,
  loading: loading.models.rule,
}))
@Form.create()
class SubAccountControl extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    updateFormValues: {},
  };

  static defaultProps = {
    user: {
      list: [],
    },
    role: {
      list: [],
    },
  };

  columns = [
    {
      title: '子账号用户名',
      dataIndex: 'loginName',
      key: 'loginName',
      render: name => <a onClick={() => this.previewItem(name)}>{name}</a>,
    },
    {
      title: '联系人',
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: '手机号',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '创建时间',
      dataIndex: 'loginDate',
      sorter: true,
      render: val => val && <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '子账号类型',
      dataIndex: 'mobile',
    },
    {
      title: '账号状态',
      dataIndex: 'email',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetch',
      payload: {
        pageNo: 1,
        pageSize: 10,
      },
    });
    dispatch({
      type: 'role/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'user/fetch',
      payload: params,
    });
  };

  previewItem = id => {
    router.push(`/profile/basic/${id}`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'user/fetch',
      payload: {},
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'user/remove',
          payload: selectedRows.map(row => row.id),
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'user/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      updateFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const EncryptPassword = this.handleEncrypt(fields.password);
    dispatch({
      type: 'user/add',
      payload: {
        loginName: fields.loginName,
        password: EncryptPassword,
        realName: fields.realName,
        roleId: fields.roleId,
        phone: fields.phone,
        email: fields.email,
        mobile: fields.mobile,
      },
    });
    this.handleModalVisible();
  };

  handleUpdate = (fields, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/update',
      payload: {
        id,
        realName: fields.realName,
        loginName: fields.loginName,
        roleId: fields.roleId,
        phone: fields.phone,
        email: fields.email,
        mobile: fields.mobile,
      },
    });

    this.handleUpdateModalVisible();
  };

  handleEncrypt = beforePwd => {
    const secretKey = 'com.vcpay.foo.key';
    const afterEncrypt = CryptoJS.DES.encrypt(beforePwd, CryptoJS.enc.Utf8.parse(secretKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
    return afterEncrypt;
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { role } = this.props;
    const roleList = role.list;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="子账号用户名">
              {getFieldDecorator('loginName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系人">
              {getFieldDecorator('lognName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('loginame')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      user: { list },
      role,
      loading,
    } = this.props;
    const roleList = role.list;
    const { selectedRows, modalVisible, updateModalVisible, updateFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="子账号管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              <Button onClick={() => {}}>激活</Button>
              <Button type="danger" onClick={() => {}}>
                注销
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              rowKey="encryptionId"
              selectedRows={selectedRows}
              loading={loading}
              data={list}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} roleList={roleList} />
        {updateFormValues && Object.keys(updateFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={updateFormValues}
            roleList={roleList}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default SubAccountControl;
