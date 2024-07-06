import React, { useEffect, useState } from 'react'
import { useFetchApi } from '../hooks/useFetchApi'
import { fetchApiOptionCollection } from '../api/index'
import { IAddress, ISqlRow, IField } from '../types'
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

const FieldManager: React.FC = () => {
  const { fetchApi } = useFetchApi()
  const [fieldArray, setFieldArray] = useState<IField[]>([])
  const [addressArray, setAddressArray] = useState<IAddress[]>([])
  const { message } = App.useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [updateRecord, setUpdateRecord] = useState<IField>()
  const [form] = Form.useForm()

  const onDelete = async (key: IField['key']) => {
    const { message: msg } = await fetchApi<ISqlRow<IField>>({
      ...fetchApiOptionCollection.fieldDelete,
      data: {
        deleteData: {
          key: key,
        },
      },
    })
    if (msg == 'successful') {
      message.success(msg)
      refreshFieldArray()
    } else {
      message.error(msg)
    }
  }

  const onUpdateSubmit: FormProps<Omit<IField, 'key'>>['onFinish'] = async (
    values
  ) => {
    const newData = deepCompare(values, updateRecord)

    if (Object.keys(newData).length === 0) {
      return message.error('Failed')
    }

    const { message: msg } = await fetchApi<ISqlRow<IField>>({
      ...fetchApiOptionCollection.fieldUpdate,
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
      refreshFieldArray()
      setIsUpdateModalOpen(false)
    } else {
      message.error(msg)
    }
  }

  const onUpdateSubmitFailed: FormProps<
    Omit<IField, 'key'>
  >['onFinishFailed'] = (errorInfo) => {
    message.error('Failed:' + errorInfo)
  }

  const onUpdate = (record: IField) => {
    setIsUpdateModalOpen(true)
    setUpdateRecord(record)
  }

  const columns: TableProps<IField>['columns'] = [
    {
      title: 'Address',
      dataIndex: ['address', 'name'],
      key: 'address',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
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

  const refreshFieldArray = async (requestData?: ISqlRow<IField>) => {
    const { data } = await fetchApi<ISqlRow<IField>, any[]>({
      ...fetchApiOptionCollection.fieldRead,
      data: requestData,
    })

    setFieldArray(data)
  }

  const refreshAddressArray = async () => {
    const { data } = await fetchApi<ISqlRow<IField>, any[]>(
      fetchApiOptionCollection.addressRead
    )

    setAddressArray(data)
  }

  const onSearch: FormProps<Pick<IField, 'name'>>['onFinish'] = (values) => {
    if (!values.name || values.name.length === 0) {
      refreshFieldArray()
    } else {
      refreshFieldArray({
        selectData: {
          name: values.name,
        },
        rule: {
          name: true,
        },
      })
    }
  }

  const onSearchFailed: FormProps<Pick<IField, 'name'>>['onFinishFailed'] = (
    errorInfo
  ) => {
    message.error('Failed:' + errorInfo)
  }

  const onCreateSubmit: FormProps<Omit<IField, 'key'>>['onFinish'] = async (
    values
  ) => {
    setBtnLoading(true)
    const { message: msg } = await fetchApi<ISqlRow<IField>>({
      ...fetchApiOptionCollection.fieldCreate,
      data: {
        insertData: values,
      },
    })
    setBtnLoading(false)

    if (msg == 'successful') {
      message.success(msg)
      setIsModalOpen(false)
      refreshFieldArray()
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

  const onCreateFailed: FormProps<Omit<IField, 'key'>>['onFinishFailed'] = (
    errorInfo
  ) => {
    message.error('Failed:' + errorInfo)
  }

  const onCreate = () => {
    setIsModalOpen(true)
  }

  useEffect(() => {
    refreshFieldArray()
    refreshAddressArray()
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
          <Form.Item<Pick<IField, 'name'>> label="name" name="name">
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
              <Form.Item<Omit<IField, 'key'>>
                label="address"
                name={['address', 'key']}
                rules={[{ required: true }]}
              >
                <Select
                  style={{ width: 120 }}
                  options={addressArray.map((address) => ({
                    value: address.key,
                    label: address.name,
                  }))}
                />
              </Form.Item>
              <Form.Item<Omit<IField, 'key'>>
                label="name"
                name="name"
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
        <Table columns={columns} dataSource={fieldArray}></Table>
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
          <Form.Item<Omit<IField, 'key'>>
            label="address"
            name={['address', 'key']}
            rules={[{ required: true }]}
          >
            <Select
              style={{ width: 120 }}
              options={addressArray.map((address) => ({
                value: address.key,
                label: address.name,
              }))}
            />
          </Form.Item>
          <Form.Item<Omit<IField, 'key'>>
            label="name"
            name="name"
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

export default FieldManager
