import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6AD9FF',
    alignItems: 'center',
  },

  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postText: {
    fontSize: 16,
    marginBottom: 10,
  },
  postDate: {
    color: '#888',
    fontSize: 12,
  },
  form: {
    flex: 1,
    padding: 20,
    backgroundColor: '#3B5998',
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    color: '#333',
    fontFamily: 'Times New Roman',
    fontStyle: 'italic',

  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#3B5998',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#333',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#6AD9FF',
    width: '100%',
    marginTop: 0,
    marginLeft: 0,
    marginBottom: 0,
    alignItems: 'center',
  },
  buttonContainerWelcome: {   
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#6AD9FF',
    width: '100%',
    marginTop: 0,
    marginLeft: 0,
    marginBottom: 0,
    alignItems: 'center',
  },
  button: {
    width: '40%',
    height: 40,
    borderRadius: 5,
    backgroundColor: '#9883EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 5,
    marginBottom: 2,    
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold', 
    fontFamily: 'Times New Roman',   
    fontStyle: 'italic',
  },

  signOutButton: {
    marginTop: 20,
  },
  image: {
    width: 100, 
    height: 150, 
    resizeMode: 'cover', 
    margin: 5, 
  },
});
