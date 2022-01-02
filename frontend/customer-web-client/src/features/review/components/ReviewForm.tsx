import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { Button, Form, Input, Rate, Row, Typography, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { ReactElement } from 'react';

interface ReviewFormProps {
  imageList: Array<any>;
  postingReview: boolean;
  onSubmit: (values: any) => void;
  onImageListChange: (file: UploadChangeParam<UploadFile<any>>) => void;
}

export default function ReviewForm({
  imageList,
  postingReview,
  onSubmit,
  onImageListChange,
}: ReviewFormProps): ReactElement {
  return (
    <Form onFinish={onSubmit}>
      <Typography.Title level={5}>Your review</Typography.Title>

      <Form.Item
        label="Content"
        name="content"
        style={{ marginBottom: 5 }}
        rules={[{ required: true }]}
      >
        <Input.TextArea autoSize={{ minRows: 4, maxRows: 4 }} />
      </Form.Item>

      <Form.Item
        name="rating"
        style={{ marginBottom: 5 }}
        rules={[{ required: true }]}
        initialValue={0}
      >
        <Rate allowHalf />
      </Form.Item>

      <Form.Item
        label="Images"
        name="images"
        valuePropName="images"
        style={{ marginBottom: 5 }}
      >
        <Upload
          listType="picture-card"
          fileList={imageList}
          onChange={onImageListChange}
          multiple
          beforeUpload={(_) => false}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Row justify="end">
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            loading={postingReview}
          >
            Post
          </Button>
        </Row>
      </Form.Item>
    </Form>
  );
}
