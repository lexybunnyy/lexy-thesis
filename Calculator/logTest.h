#include <iostream>
#include <stdio.h>
#include <math.h>
#include <vector>
#include <algorithm>

using namespace std;

typedef vector<vector<double> > DMatrix;
typedef vector<double> DArray;

void interpolationMatrixTest();
void polynomialTest();

void logPolynomial(DArray P, string poliName);
void logCalculate(int i, int j, DMatrix M, DArray x);
void logResult(DArray x, DMatrix M);
void logVector(DArray P, string vectorName);

void getVectorStd(DArray &P, string poliName);
void getPointsTest(DArray &X, DMatrix &Y);
void getPointsStd(DArray &x, DMatrix &M);

void getInterpolationMatrix(DArray X, DMatrix Y, DArray &intpX, DMatrix &intpM);
void interpolateMatrix(DArray &x, DMatrix &M);

DArray polynomialAddition(DArray P, DArray Q);
DArray polynomialMultiply(DArray P, DArray Q);
void polynomialSimplfy(DArray &P);
void fuggveny(double x);

DArray l(int j, DArray X);
DArray getLagrangePolinomyal(DArray X, DArray Y);
DArray omega(int j, DArray X);
DArray getNewtonPolinomyal(DArray inpX, DArray inpMDiag);

bool checkEqual(DArray one, DArray two);
bool testLagrange(bool logPoly);
void manualInterpolationTest();
bool testNewton(bool logPoly);
