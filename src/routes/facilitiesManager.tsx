import React, { useEffect, useState } from 'react'
import { useFetchApi } from '../hooks/useFetchApi'
import { fetchApiOptionCollection } from '../api/index'
import { IField, ISqlRow, IFacilities } from '../types'
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

const FacilitiesManager: React.FC = () => {
  const { fetchApi } = useFetchApi()
  const [facilitiesArray, setFacilitiesArray] = useState<IFacilities[]>([])
  const [fieldArray, setFieldArray] = useState<IField[]>([])
  const { message } = App.useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [updateRecord, setUpdateRecord] = useState<IFacilities>()
  const [form] = Form.useForm()

  const onDelete = async (key: IFacilities['key']) => {
    const { message: msg } = await fetchApi<ISqlRow<IFacilities>>({
      ...fetchApiOptionCollection.facilitiesDelete,
      data: {
        deleteData: {
          key: key,
        },
      },
    })
    if (msg == 'successful') {
      message.success(msg)
      refreshFacilitiesArray()
    } else {
      message.error(msg)
    }
  }

  const onUpdateSubmit: FormProps<
    Omit<IFacilities, 'key'>
  >['onFinish'] = async (values) => {
    const newData = deepCompare(values, updateRecord)

    if (Object.keys(newData).length === 0) {
      return message.error('Failed')
    }

    const { message: msg } = await fetchApi<ISqlRow<IFacilities>>({
      ...fetchApiOptionCollection.facilitiesUpdate,
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
      refreshFacilitiesArray()
      setIsUpdateModalOpen(false)
    } else {
      message.error(msg)
    }
  }

  const onUpdateSubmitFailed: FormProps<
    Omit<IFacilities, 'key'>
  >['onFinishFailed'] = (errorInfo) => {
    message.error('Failed:' + errorInfo)
  }

  const onUpdate = (record: IFacilities) => {
    setIsUpdateModalOpen(true)
    setUpdateRecord(record)
  }

  const columns: TableProps<IFacilities>['columns'] = [
    {
      title: 'Field',
      dataIndex: ['field', 'name'],
      key: 'field',
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

  const refreshFacilitiesArray = async (requestData?: ISqlRow<IFacilities>) => {
    const { data } = await fetchApi<ISqlRow<IFacilities>, any[]>({
      ...fetchApiOptionCollection.facilitiesRead,
      data: requestData,
    })

    setFacilitiesArray(data)
  }

  const refreshFieldArray = async () => {
    const { data } = await fetchApi<ISqlRow<IFacilities>, any[]>(
      fetchApiOptionCollection.fieldRead
    )

    setFieldArray(data)
  }

  const onSearch: FormProps<Pick<IFacilities, 'name'>>['onFinish'] = (
    values
  ) => {
    if (!values.name || values.name.length === 0) {
      refreshFacilitiesArray()
    } else {
      refreshFacilitiesArray({
        selectData: {
          name: values.name,
        },
        rule: {
          name: true,
        },
      })
    }
  }

  const onSearchFailed: FormProps<
    Pick<IFacilities, 'name'>
  >['onFinishFailed'] = (errorInfo) => {
    message.error('Failed:' + errorInfo)
  }

  const onCreateSubmit: FormProps<
    Omit<IFacilities, 'key'>
  >['onFinish'] = async (values) => {
    setBtnLoading(true)
    const { message: msg } = await fetchApi<ISqlRow<IFacilities>>({
      ...fetchApiOptionCollection.facilitiesCreate,
      data: {
        insertData: values,
      },
    })
    setBtnLoading(false)

    if (msg == 'successful') {
      message.success(msg)
      setIsModalOpen(false)
      refreshFacilitiesArray()
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

  const onCreateFailed: FormProps<
    Omit<IFacilities, 'key'>
  >['onFinishFailed'] = (errorInfo) => {
    message.error('Failed:' + errorInfo)
  }

  const onCreate = () => {
    setIsModalOpen(true)
  }

  useEffect(() => {
    refreshFacilitiesArray()
    refreshFieldArray()
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
          <Form.Item<Pick<IFacilities, 'name'>> label="name" name="name">
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
              <Form.Item<Omit<IFacilities, 'key'>>
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
              <Form.Item<Omit<IFacilities, 'key'>>
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
        <Table columns={columns} dataSource={facilitiesArray}></Table>
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
          <Form.Item<Omit<IFacilities, 'key'>>
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
          <Form.Item<Omit<IFacilities, 'key'>>
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

export default FacilitiesManager
