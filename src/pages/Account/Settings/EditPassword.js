import React from 'react';
import { Row, Card, Icon, Form, Input, Button } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import CryptoJS from 'crypto-js';

@Form.create()
@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class EditPassword extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getcaptcha = this.getcaptcha.bind(this);
  }

  getcaptcha() {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'user/sendMsg',
      payload: {
        phone: currentUser.mobile,
      },
    });
  }

  handleEncrypt = beforePwd => {
    const secretKey = 'com.vcpay.foo.key';
    const afterEncrypt = CryptoJS.DES.encrypt(beforePwd, CryptoJS.enc.Utf8.parse(secretKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
    return afterEncrypt;
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword2')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  handleSubmit(e) {
    const { form } = this.props;
    const { dispatch, currentUser } = this.props;
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'user/update',
          payload: {
            password: this.handleEncrypt(fieldsValue.password),
            newPassword: this.handleEncrypt(fieldsValue.newPassword),
            encryptionId: currentUser.encryptionId,
            loginName: currentUser.loginName,
            realName: currentUser.realName,
            roleId: currentUser.roleId,
          },
        });
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      currentUser,
    } = this.props;
    return (
      <PageHeaderWrapper title="修改密码">
        <Card>
          <Row>
            <Form
              layout="horizontal"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              onSubmit={this.handleSubmit}
            >
              <Form.Item label="原密码">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Password"
                  />
                )}
              </Form.Item>
              <Form.Item label="新密码">
                {getFieldDecorator('newPassword2', {
                  rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Password"
                  />
                )}
              </Form.Item>
              <Form.Item label="确认密码">
                {getFieldDecorator('newPassword', {
                  rules: [
                    { required: true, message: 'Please input your Password!' },
                    { validator: this.compareToFirstPassword },
                  ],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Password"
                  />
                )}
              </Form.Item>
              {/* <Form.Item label="手机号">
                  <Input placeholder="phone" value={currentUser.mobile} />
                </Form.Item>
                <Form.Item
                  label="验证码"
                  extra="We must make sure that your are a human."
                >
                  <Row gutter={8}>
                    <Col span={12}>
                      {getFieldDecorator('captcha', {
                                        rules: [{ required: true, message: 'Please input the captcha you got!' }],
                                    })(
                                      <Input />
                                    )}
                    </Col>
                    <Col span={12}>
                      <Button onClick={this.getcaptcha}>Get captcha</Button>
                    </Col>
                  </Row>
                </Form.Item> */}
              <Form.Item wrapperCol={{ offset: 4 }}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default EditPassword;
