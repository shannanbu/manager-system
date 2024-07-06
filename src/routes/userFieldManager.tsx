import React, { useEffect, useState } from 'react'
import { useFetchApi } from '../hooks/useFetchApi'
import { fetchApiOptionCollection } from '../api/index'
import { IField, ISqlRow, IUserField } from '../types'
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

const UserFieldManager: React.FC = () => {
  const { fetchApi } = useFetchApi()
  const [userFieldArray, setUserFieldArray] = useState<IUserField[]>([])
  const [userArray, setUserArray] = useState<IField[]>([])
  const [fieldArray, setFieldArray] = useState<IField[]>([])
  const { message } = App.useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [updateRecord, setUpdateRecord] = useState<IUserField>()
  const [form] = Form.useForm()

  const onDelete = async (key: IUserField['key']) => {
    const { message: msg } = await fetchApi<ISqlRow<IUserField>>({
      ...fetchApiOptionCollection.userFieldDelete,
      data: {
        deleteData: {
          key: key,
        },
      },
    })
    if (msg == 'successful') {
      message.success(msg)
      refreshUserFieldArray()
    } else {
      message.error(msg)
    }
  }

  const onUpdateSubmit: FormProps<Omit<IUserField, 'key'>>['onFinish'] = async (
    values
  ) => {
    const newData = deepCompare(values, updateRecord)

    if (Object.keys(newData).length === 0) {
      return message.error('Failed')
    }

    const { message: msg } = await fetchApi<ISqlRow<IUserField>>({
      ...fetchApiOptionCollection.userFieldUpdate,
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
      refreshUserFieldArray()
      setIsUpdateModalOpen(false)
    } else {
      message.error(msg)
    }
  }

  const onUpdateSubmitFailed: FormProps<
    Omit<IUserField, 'key'>
  >['onFinishFailed'] = (errorInfo) => {
    message.error('Failed:' + errorInfo)
  }

  const onUpdate = (record: IUserField) => {
    setIsUpdateModalOpen(true)
    setUpdateRecord(record)
  }

  const columns: TableProps<IUserField>['columns'] = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'User',
      dataIndex: ['user', 'name'],
      key: 'user',
    },
    {
      title: 'Field',
      dataIndex: ['field', 'name'],
      key: 'field',
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

  const refreshUserFieldArray = async (requestData?: ISqlRow<IUserField>) => {
    const { data } = await fetchApi<ISqlRow<IUserField>, any[]>({
      ...fetchApiOptionCollection.userFieldRead,
      data: requestData,
    })

    setUserFieldArray(data)
  }

  const refreshUserArray = async () => {
    const { data } = await fetchApi<ISqlRow<IUserField>, any[]>(
      fetchApiOptionCollection.userRead
    )

    setUserArray(data)
  }

  const refreshFieldArray = async () => {
    const { data } = await fetchApi<ISqlRow<IUserField>, any[]>(
      fetchApiOptionCollection.fieldRead
    )

    setFieldArray(data)
  }

  const onSearch: FormProps<Pick<IUserField, 'key'>>['onFinish'] = (values) => {
    if (!values.key || values.key.length === 0) {
      refreshUserFieldArray()
    } else {
      refreshUserFieldArray({
        selectData: {
          key: values.key,
        },
        rule: {
          key: true,
        },
      })
    }
  }

  const onSearchFailed: FormProps<Pick<IUserField, 'key'>>['onFinishFailed'] = (
    errorInfo
  ) => {
    message.error('Failed:' + errorInfo)
  }

  const onCreateSubmit: FormProps<Omit<IUserField, 'key'>>['onFinish'] = async (
    values
  ) => {
    setBtnLoading(true)
    const { message: msg } = await fetchApi<ISqlRow<IUserField>>({
      ...fetchApiOptionCollection.userFieldCreate,
      data: {
        insertData: values,
      },
    })
    setBtnLoading(false)

    if (msg == 'successful') {
      message.success(msg)
      setIsModalOpen(false)
      refreshUserFieldArray()
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

  const onCreateFailed: FormProps<Omit<IUserField, 'key'>>['onFinishFailed'] = (
    errorInfo
  ) => {
    message.error('Failed:' + errorInfo)
  }

  const onCreate = () => {
    setIsModalOpen(true)
  }

  useEffect(() => {
    refreshUserFieldArray()
    refreshFieldArray()
    refreshUserArray()
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
          <Form.Item<Pick<IUserField, 'key'>> label="name" name="key">
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
              <Form.Item<Omit<IUserField, 'key'>>
                label="field"
                name={['field', 'key']}
                rules={[{ required: true }]}
              >
                <Select
                  style={{ width: 120 }}
                  options={fieldArray.map((field) => ({
                    value: field.key,
                    label: field.name,
                  }))}
                />
              </Form.Item>
              <Form.Item<Omit<IUserField, 'key'>>
                label="user"
                name={['user', 'key']}
                rules={[{ required: true }]}
              >
                <Select
                  style={{ width: 120 }}
                  options={userArray.map((user) => ({
                    value: user.key,
                    label: user.name,
                  }))}
                />
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
        <Table columns={columns} dataSource={userFieldArray}></Table>
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
          <Form.Item<Omit<IUserField, 'key'>>
            label="field"
            name={['field', 'key']}
            rules={[{ required: true }]}
          >
            <Select
              style={{ width: 120 }}
              options={fieldArray.map((field) => ({
                value: field.key,
                label: field.name,
              }))}
            />
          </Form.Item>
          <Form.Item<Omit<IUserField, 'key'>>
            label="user"
            name={['user', 'key']}
            rules={[{ required: true }]}
          >
            <Select
              style={{ width: 120 }}
              options={userArray.map((user) => ({
                value: user.key,
                label: user.name,
              }))}
            />
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

export default UserFieldManager
