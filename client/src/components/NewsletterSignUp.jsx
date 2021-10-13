import { Button, Form, Grid, Input } from 'semantic-ui-react';

const NewsletterSignUp = () => {
  return (
    <Form>
      <Grid>
        <Grid.Column width="12">
          <Form.Field className="ms-3">
            <Input
              label="Sign up for our newsletter"
              placeholder="Enter your email"
            />
          </Form.Field>
        </Grid.Column>
        <Grid.Column width="4" textAlign="left">
          <Button type="submit" color="teal">
            Subscribe
          </Button>
        </Grid.Column>
      </Grid>
    </Form>
  );
};

export default NewsletterSignUp;
