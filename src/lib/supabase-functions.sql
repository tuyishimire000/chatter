-- Function to set current user phone for RLS context
CREATE OR REPLACE FUNCTION set_current_user_phone(phone TEXT)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_user_phone', phone, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set admin phone for RLS context
CREATE OR REPLACE FUNCTION set_admin_phone(phone TEXT)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.admin_phone', phone, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION set_current_user_phone(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION set_admin_phone(TEXT) TO authenticated;
