/** main.cpp
$ g++ -std=c++11 -c main.cpp calculator.cpp logTest.cpp
$ g++ -o hello.out main.o calculator.o logTest.o
./hello.out
*/
#include "calculator.h"
#include "logTest.h"

using namespace std;

int main()
{
	if (testAll()) {
		cout << "Ok!" << endl;
	}
    //testMatrixInterpolation();
    //testPolynomial();
    return 0;
}
