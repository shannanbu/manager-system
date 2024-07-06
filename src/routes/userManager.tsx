import React, { useEffect, useState } from 'react'
import { useFetchApi } from '../hooks/useFetchApi'
import { fetchApiOptionCollection } from '../api/index'
import { IRole, ISqlRow, IUser } from '../types'
import {
  Table,
  TableProps,
  Button,
  Form,
  Input,
  App,
  Modal,
  Select,
} from 'antd'
import type { FormProps } from 'antd'
import { deepCompare } from '../utils/index'

const UserManager: React.FC = () => {
  const { fetchApi } = useFetchApi()
  const [userArray, setUserArray] = useState<IUser[]>([])
  const [roleArray, setRoleArray] = useState<IRole[]>([])
  const { message } = App.useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [updateRecord, setUpdateRecord] = useState<IUser>()
  const [form] = Form.useForm()

  const onDelete = async (key: IUser['key']) => {
    const { message: msg } = await fetchApi<ISqlRow<IUser>>({
      ...fetchApiOptionCollection.userDelete,
      data: {
        deleteData: {
          key: key,
        },
      },
    })
    if (msg == 'successful') {
      message.success(msg)
      refreshUserArray()
    } else {
      message.error(msg)
    }
  }

  const onUpdateSubmit: FormProps<Omit<IUser, 'key'>>['onFinish'] = async (
    values
  ) => {
    const newData = deepCompare(values, updateRecord)

    if (Object.keys(newData).length === 0) {
      return message.error('Failed')
    }

    const { message: msg } = await fetchApi<ISqlRow<IUser>>({
      ...fetchApiOptionCollection.userUpdate,
      data: {
        updateData: {
          newData: newData,
          oldData: {
            key: updateRecord.key,
          },
        },
      },
    })
    if (msg == 'successful') {
      message.success(msg)
      refreshUserArray()
      setIsUpdateModalOpen(false)
    } else {
      message.error(msg)
    }
  }

  const onUpdateSubmitFailed: FormProps<
    Omit<IUser, 'key'>
  >['onFinishFailed'] = (errorInfo) => {
    message.error('Failed:' + errorInfo)
  }

  const onUpdate = (record: IUser) => {
    setIsUpdateModalOpen(true)
    setUpdateRecord(record)
  }

  const columns: TableProps<IUser>['columns'] = [
    {
      title: 'Role',
      dataIndex: ['role', 'name'],
      key: 'role',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Pwd',
      dataIndex: 'pwd',
      key: 'pwd',
    },
    {
      title: 'ContactPhone',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => {
        return (
          <div>
            <Button
              className="mr-1"
              type="primary"
              onClick={() => onUpdate(record)}
            >
              Update
            </Button>
            <Button type="primary" onClick={() => onDelete(record.key)}>
              Delete
            </Button>
          </div>
        )
      },
    },
  ]

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const refreshUserArray = async (requestData?: ISqlRow<IUser>) => {
    const { data } = await fetchApi<ISqlRow<IUser>, any[]>({
      ...fetchApiOptionCollection.userRead,
      data: requestData,
    })

    setUserArray(data)
  }

  const refreshRoleArray = async () => {
    const { data } = await fetchApi<ISqlRow<IUser>, any[]>(
      fetchApiOptionCollection.roleRead
    )

    setRoleArray(data)
  }

  const onSearch: FormProps<Pick<IUser, 'name'>>['onFinish'] = (values) => {
    if (!values.name || values.name.length === 0) {
      refreshUserArray()
    } else {
      refreshUserArray({
        selectData: {
          name: values.name,
        },
        rule: {
          name: true,
        },
      })
    }
  }

  const onSearchFailed: FormProps<Pick<IUser, 'name'>>['onFinishFailed'] = (
    errorInfo
  ) => {
    message.error('Failed:' + errorInfo)
  }

  const onCreateSubmit: FormProps<Omit<IUser, 'key'>>['onFinish'] = async (
    values
  ) => {
    setBtnLoading(true)
    const { message: msg } = await fetchApi<ISqlRow<IUser>>({
      ...fetchApiOptionCollection.userCreate,
      data: {
        insertData: values,
      },
    })
    setBtnLoading(false)

    if (msg == 'successful') {
      message.success(msg)
      setIsModalOpen(false)
      refreshUserArray()
    } else {
      message.error(msg)
    }
  }

  useEffect(() => {
    if (isUpdateModalOpen) {
      form.setFieldsValue(updateRecord)
    } else {
      form.resetFields()
    }
  }, [form, isUpdateModalOpen, updateRecord])

  const onCreateFailed: FormProps<Omit<IUser, 'key'>>['onFinishFailed'] = (
    errorInfo
  ) => {
    message.error('Failed:' + errorInfo)
  }

  const onCreate = () => {
    setIsModalOpen(true)
  }

  useEffect(() => {
    refreshUserArray()
    refreshRoleArray()
  }, [])

  return (
    <div>
      <div className="flex justify-between mb-1">
        <Form
          name="search"
          layout={'inline'}
          onFinish={onSearch}
          onFinishFailed={onSearchFailed}
          autoComplete="off"
        >
          <Form.Item<Pick<IUser, 'name'>> label="name" name="name">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <div>
          <Button type="primary" htmlType="submit" onClick={onCreate}>
            Create
          </Button>

          <Modal
            title="Create"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={[]}
          >
            <Form
              name="create"
              autoComplete="off"
              onFinish={onCreateSubmit}
              onFinishFailed={onCreateFailed}
            >
              <Form.Item<Omit<IUser, 'key'>>
                label="role"
                name={['role', 'key']}
                rules={[{ required: true }]}
              >
                <Select
                  style={{ width: 120 }}
                  options={roleArray.map((role) => ({
                    value: role.key,
                    label: role.name,
                  }))}
                />
              </Form.Item>
              <Form.Item<Omit<IUser, 'key'>>
                label="name"
                name="name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item<Omit<IUser, 'key'>>
                label="pwd"
                name="pwd"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item<Omit<IUser, 'key'>>
                label="contactPhone"
                name="contactPhone"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item className="flex justify-end">
                <Button
                  className="mr-1"
                  type="primary"
                  htmlType="submit"
                  loading={btnLoading}
                >
                  Submit
                </Button>
                <Button htmlType="reset" onClick={handleCancel}>
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
      <div>
        <Table columns={columns} dataSource={userArray}></Table>
      </div>
      <Modal
        forceRender
        title="Update"
        footer={[]}
        open={isUpdateModalOpen}
        onCancel={() => setIsUpdateModalOpen(false)}
      >
        <Form
          form={form}
          name="update"
          autoComplete="off"
          onFinish={onUpdateSubmit}
          onFinishFailed={onUpdateSubmitFailed}
        >
          <Form.Item<Omit<IUser, 'key'>>
            label="role"
            name={['role', 'key']}
            rules={[{ required: true }]}
          >
            <Select
              style={{ width: 120 }}
              options={roleArray.map((role) => ({
                value: role.key,
                label: role.name,
              }))}
            />
          </Form.Item>
          <Form.Item<Omit<IUser, 'key'>>
            label="name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<Omit<IUser, 'key'>>
            label="pwd"
            name="pwd"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<Omit<IUser, 'key'>>
            label="contactPhone"
            name="contactPhone"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item className="flex justify-end">
            <Button
              className="mr-1"
              type="primary"
              htmlType="submit"
              loading={btnLoading}
            >
              Submit
            </Button>
            <Button
              htmlType="reset"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserManager
